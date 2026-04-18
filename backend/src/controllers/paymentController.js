const stripe = require('../utils/stripe');
const Payment = require('../models/Payment');
const User = require('../models/User');
const Quote = require('../models/Quote');
const Project = require('../models/Project');
const DesignerQuote = require('../models/DesignerQuote');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

// Crear un PaymentIntent para que el cliente pague su cotización aceptada
// 1. Evitar registros duplicados al crear el Intent
const createClientPaymentIntent = asyncHandler(async (req, res) => {
    const { quoteId } = req.params;
    const userId = req.user.id;

    const quote = await Quote.findById(quoteId).populate('request');
    if (!quote) return res.status(404).json(ApiResponse.notFound('Cotización no encontrada').toJSON());

    if (quote.status !== 'accepted') {
        return res.status(400).json(ApiResponse.error('La cotización debe estar aceptada para pagar', 400).toJSON());
    }

    // --- MEJORA: Buscar si ya existe un pago pendiente para NO crear otro ---
    const existingPendingPayment = await Payment.findOne({
        quote: quoteId,
        status: 'pending',
        user: userId
    });

    if (existingPendingPayment) {
        return res.status(200).json(
            ApiResponse.success('Intent recuperado', {
                clientSecret: existingPendingPayment.metadata.clientSecret,
                paymentId: existingPendingPayment._id,
            }).toJSON()
        );
    }

    // Si no hay pendiente, procedemos a crear uno nuevo en Stripe
    let user = await User.findById(userId);
    let stripeCustomerId = user.stripeCustomerId;

    if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
            email: user.email,
            name: user.name,
            metadata: { userId: user._id.toString() },
        });
        stripeCustomerId = customer.id;
        user.stripeCustomerId = stripeCustomerId;
        await user.save();
    }

    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(quote.amount * 100),
        currency: 'eur',
        customer: stripeCustomerId,
        metadata: { quoteId: quote._id.toString(), userId, type: 'client_payment' },
        automatic_payment_methods: { enabled: true },
    });

    const payment = await Payment.create({
        user: userId,
        quote: quoteId,
        amount: quote.amount,
        currency: 'eur',
        type: 'client_payment',
        status: 'pending',
        stripePaymentIntentId: paymentIntent.id,
        metadata: { clientSecret: paymentIntent.client_secret },
    });

    res.status(200).json(ApiResponse.success('PaymentIntent creado', {
        clientSecret: paymentIntent.client_secret,
        paymentId: payment._id,
    }).toJSON());
});


// Obtener todos los pagos del usuario autenticado
const getUserPayments = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    const filter = { user: userId };
    if (status) filter.status = status;

    const payments = await Payment.find(filter)
        .populate('project', 'title')
        .populate('quote', 'amount description')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const total = await Payment.countDocuments(filter);

    res.status(200).json(
        ApiResponse.success('Pagos obtenidos', {
            payments,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit),
            },
        }).toJSON()
    );
});

// Obtener resumen de pagos del usuario
const getUserPaymentSummary = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const totalPaidAgg = await Payment.aggregate([
        { $match: { user: userId, status: 'succeeded', type: 'client_payment' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalPaid = totalPaidAgg[0]?.total || 0;

    const pendingAgg = await Payment.aggregate([
        { $match: { user: userId, status: 'pending', type: 'client_payment' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const pendingAmount = pendingAgg[0]?.total || 0;

    const upcomingPayments = await Payment.countDocuments({ user: userId, status: 'pending' });

    // Estadísticas por mes (últimos 12 meses)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const paymentStats = await Payment.aggregate([
        {
            $match: {
                user: userId,
                status: 'succeeded',
                paidAt: { $gte: twelveMonthsAgo },
            },
        },
        {
            $group: {
                _id: {
                    year: { $year: '$paidAt' },
                    month: { $month: '$paidAt' },
                },
                total: { $sum: '$amount' },
            },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const monthsNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const formattedStats = paymentStats.map(stat => ({
        month: `${monthsNames[stat._id.month - 1]} ${stat._id.year}`,
        total: stat.total,
    }));

    res.status(200).json(
        ApiResponse.success('Resumen de pagos', {
            totalPaid,
            pendingAmount,
            upcomingPayments,
            paymentStats: formattedStats,
        }).toJSON()
    );
});

// Obtener métodos de pago del usuario (desde Stripe)
const getPaymentMethods = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const user = await User.findById(userId);

    // Si el usuario no tiene ID de Stripe, devolvemos lista vacía sin error
    if (!user || !user.stripeCustomerId) {
        return res.status(200).json(ApiResponse.success('Métodos de pago', []).toJSON());
    }

    try {
        const paymentMethods = await stripe.paymentMethods.list({
            customer: user.stripeCustomerId,
            type: 'card',
        });

        const formatted = paymentMethods.data.map(pm => ({
            id: pm.id,
            type: 'card',
            last4: pm.card.last4,
            brand: pm.card.brand,
            expiryMonth: pm.card.exp_month,
            expiryYear: pm.card.exp_year,
            isDefault: false,
        }));

        res.status(200).json(ApiResponse.success('Métodos de pago', formatted).toJSON());
    } catch (error) {
        // Si Stripe da error porque el cliente no existe (ej. borraste datos de prueba)
        // devolvemos lista vacía en lugar de un error 400
        console.error("Stripe Error:", error.message);
        res.status(200).json(ApiResponse.success('Métodos de pago', []).toJSON());
    }
});

// Webhook de Stripe
const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;

        // 1. Actualizar el registro de Pago
        const payment = await Payment.findOneAndUpdate(
            { stripePaymentIntentId: paymentIntent.id },
            { status: 'succeeded', paidAt: new Date() },
            { new: true }
        );

        // 2. Actualizar la Cotización a 'paid'
        if (payment && payment.quote) {
            await Quote.findByIdAndUpdate(payment.quote, { status: 'paid' });
            console.log(`Cotización ${payment.quote} marcada como PAGADA`);
        }
    }

    res.json({ received: true });
};

// ADMIN: Pagar a un diseñador (transferencia desde la cuenta de la plataforma)
const payDesigner = asyncHandler(async (req, res) => {
    const { designerQuoteId } = req.params;
    const adminId = req.user.id; // Verificar que sea admin en el middleware

    const designerQuote = await DesignerQuote.findById(designerQuoteId).populate('designer');
    if (!designerQuote) {
        return res.status(404).json(ApiResponse.notFound('Cotización de diseñador no encontrada').toJSON());
    }

    if (designerQuote.status !== 'accepted') {
        return res.status(400).json(ApiResponse.error('El diseñador no ha aceptado la cotización', 400).toJSON());
    }

    // Verificar si ya se pagó
    const existingPayout = await Payment.findOne({ designerQuote: designerQuoteId, type: 'designer_payout', status: 'succeeded' });
    if (existingPayout) {
        return res.status(400).json(ApiResponse.error('Este diseñador ya fue pagado por este trabajo', 400).toJSON());
    }

    const designer = designerQuote.designer;
    if (!designer.stripeAccountId || designer.stripeAccountStatus !== 'active') {
        return res.status(400).json(ApiResponse.error('El diseñador no tiene una cuenta de Stripe Connect activa', 400).toJSON());
    }

    // Crear transferencia a la cuenta Connect del diseñador
    const transfer = await stripe.transfers.create({
        amount: Math.round(designerQuote.amount * 100),
        currency: 'eur',
        destination: designer.stripeAccountId,
        metadata: {
            designerQuoteId: designerQuote._id.toString(),
            projectId: designerQuote.project?.toString(),
        },
    });

    const payment = await Payment.create({
        user: designer._id,
        designerQuote: designerQuoteId,
        amount: designerQuote.amount,
        currency: 'eur',
        type: 'designer_payout',
        status: 'succeeded',
        stripeTransferId: transfer.id,
        stripeDestinationAccount: designer.stripeAccountId,
        paidAt: new Date(),
    });

    // Opcional: actualizar estado de la cotización del diseñador a 'paid'
    designerQuote.status = 'paid';
    await designerQuote.save();

    res.status(200).json(ApiResponse.success('Pago realizado al diseñador', { payment }).toJSON());
});

// ADMIN: Obtener todos los pagos (para panel admin)
const getAllPayments = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, type, status } = req.query;
    const skip = (page - 1) * limit;
    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;

    const payments = await Payment.find(filter)
        .populate('user', 'name email')
        .populate('project', 'title')
        .populate('quote')
        .populate('designerQuote')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const total = await Payment.countDocuments(filter);

    res.status(200).json(
        ApiResponse.success('Pagos obtenidos', {
            payments,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit),
            },
        }).toJSON()
    );
});

// ADMIN: Obtener transacciones de la plataforma (reporte)
const getPlatformTransactions = asyncHandler(async (req, res) => {
    // Suma de todos los pagos de clientes y pagos a diseñadores
    const clientPayments = await Payment.aggregate([
        { $match: { type: 'client_payment', status: 'succeeded' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const designerPayouts = await Payment.aggregate([
        { $match: { type: 'designer_payout', status: 'succeeded' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const platformFees = clientPayments[0]?.total * 0.1 || 0; // Ejemplo 10% de comisión

    res.status(200).json(
        ApiResponse.success('Resumen de transacciones', {
            totalCollected: clientPayments[0]?.total || 0,
            totalPaidToDesigners: designerPayouts[0]?.total || 0,
            platformFees,
        }).toJSON()
    );
});

module.exports = {
    createClientPaymentIntent,
    getUserPayments,
    getUserPaymentSummary,
    getPaymentMethods,
    handleStripeWebhook,
    payDesigner,
    getAllPayments,
    getPlatformTransactions,
};
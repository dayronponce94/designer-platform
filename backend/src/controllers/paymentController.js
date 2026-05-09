const stripe = require('../utils/stripe');
const Payment = require('../models/Payment');
const User = require('../models/User');
const Quote = require('../models/Quote');
const Project = require('../models/Project');
const DesignerQuote = require('../models/DesignerQuote');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

// Crear un PaymentIntent para que el cliente pague su cotización aceptada
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

    // USAMOS findOneAndUpdate con upsert para asegurar que si por alguna razón 
    // entran dos hilos, solo se cree un documento en MongoDB.
    const payment = await Payment.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntent.id }, // Buscamos por el ID de Stripe
        {
            $setOnInsert: { // Solo insertamos estos campos si el documento NO existe
                user: userId,
                quote: quoteId,
                amount: quote.amount,
                currency: 'eur',
                type: 'client_payment',
                status: 'pending',
                metadata: { clientSecret: paymentIntent.client_secret },
            }
        },
        {
            upsert: true, // Si no existe, créalo
            new: true,    // Devuelve el documento creado/encontrado
            setDefaultsOnInsert: true
        }
    );

    res.status(200).json(ApiResponse.success('PaymentIntent listo', {
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
        // Vital: req.body debe ser el raw body
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error(`❌ Error de Firma Webhook: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        console.log(`✅ Pago exitoso detectado: ${paymentIntent.id}`);

        // 1. Actualizar el registro de Pago y obtener el documento actualizado
        const payment = await Payment.findOneAndUpdate(
            { stripePaymentIntentId: paymentIntent.id },
            {
                status: 'succeeded',
                paidAt: new Date(),
                // Aseguramos que el status en metadata también sea coherente
                'metadata.status': 'succeeded'
            },
            { new: true }
        );

        if (!payment) {
            console.error(`⚠️ No se encontró el registro de pago para el intent: ${paymentIntent.id}`);
            return res.json({ received: true });
        }

        // 2. Actualizar la Cotización a 'paid'
        if (payment.quote) {
            const updatedQuote = await Quote.findByIdAndUpdate(
                payment.quote,
                { status: 'paid' },
                { new: true }
            );
            console.log(`✨ Cotización ${payment.quote} marcada como PAGADA. Nuevo estado: ${updatedQuote.status}`);
        }
    }

    res.json({ received: true });
};

// ADMIN: Pagar a un diseñador (transferencia desde la cuenta de la plataforma)
const payDesigner = asyncHandler(async (req, res) => {
    const { designerQuoteId } = req.params;

    // 1. Buscamos el PROYECTO asociado a esa cotización
    // Es vital encontrar el proyecto porque ahí vive el nuevo flag de pago
    const project = await Project.findOne({ designerQuote: designerQuoteId }).populate('designer');

    if (!project) {
        return res.status(404).json(ApiResponse.notFound('No se encontró un proyecto activo para esta cotización').toJSON());
    }

    // 2. Verificación de Seguridad con el nuevo flag
    if (project.designerView.isPaidToDesigner) {
        return res.status(400).json(ApiResponse.error('El pago ya ha sido procesado anteriormente para este proyecto', 400).toJSON());
    }

    const designer = project.designer;

    // 3. Validaciones de Stripe Connect
    if (!designer.stripeAccountId || designer.stripeAccountStatus !== 'active') {
        return res.status(400).json(ApiResponse.error('El diseñador no tiene una cuenta de Stripe Connect activa o configurada', 400).toJSON());
    }

    // 4. Ejecutar Transferencia en Stripe
    // Usamos project.designerView.earnings que es el snapshot oficial del pago
    let transfer;
    try {
        transfer = await stripe.transfers.create({
            amount: Math.round(project.designerView.earnings * 100),
            currency: 'eur',
            destination: designer.stripeAccountId,
            metadata: {
                projectId: project._id.toString(),
                designerQuoteId: designerQuoteId,
                action: 'designer_payout'
            },
        });
    } catch (stripeError) {
        console.error("ERROR REAL DE STRIPE:", stripeError.message);
        return res.status(400).json(
            ApiResponse.error(`Error de Stripe: ${stripeError.message}`, 400).toJSON()
        );
    }

    // 5. Actualización del Proyecto (El Trigger Maestro)
    // Marcamos que el diseñador YA cobró en el snapshot del proyecto
    project.designerView.isPaidToDesigner = true;
    project.designerView.paidAt = new Date();
    await project.save();

    // 6. Registro en la tabla de Pagos (Para historial contable)
    const paymentRecord = await Payment.create({
        user: designer._id,
        project: project._id, // Vinculación directa con el proyecto
        designerQuote: designerQuoteId,
        amount: project.designerView.earnings,
        currency: 'eur',
        type: 'designer_payout',
        status: 'succeeded',
        stripeTransferId: transfer.id,
        stripeDestinationAccount: designer.stripeAccountId,
        paidAt: new Date(),
    });


    res.status(200).json(
        ApiResponse.success('Pago transferido al diseñador con éxito', {
            payment: paymentRecord,
            isPaidToDesigner: project.designerView.isPaidToDesigner
        }).toJSON()
    );
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
        .populate({
            path: 'quote',
            populate: {
                path: 'request',
                select: 'title'
            }
        })
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

    // Suma de todos los pagos ya transferidos a diseñadores
    const designerPayouts = await Payment.aggregate([
        { $match: { type: 'designer_payout', status: 'succeeded' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const totalCollected = clientPayments[0]?.total || 0;
    const totalPaid = designerPayouts[0]?.total || 0;

    // La ganancia real de la plataforma es lo recaudado menos lo pagado
    const platformEarnings = totalCollected - totalPaid;

    res.status(200).json(
        ApiResponse.success('Resumen de transacciones', {
            totalCollected,
            totalPaidToDesigners: totalPaid,
            platformEarnings, // Enviamos el nuevo cálculo
        }).toJSON()
    );
});

// @desc    Crear cuenta Express y generar enlace de onboarding
// @route   POST /api/payments/designer/create-connect-link
const createConnectAccountLink = asyncHandler(async (req, res) => {
    try {
        let user = await User.findById(req.user.id);

        // 1. Si no tiene cuenta de Stripe Connect, la creamos
        if (!user.stripeAccountId) {
            const account = await stripe.accounts.create({
                type: 'express',
                country: 'ES', // Ajustar según tu país (ES = España)
                email: user.email,
                capabilities: {
                    card_payments: { requested: true },
                    transfers: { requested: true },
                },
                business_type: 'individual',
                metadata: { userId: user._id.toString() }
            });
            user.stripeAccountId = account.id;
            await user.save();
        }

        // 2. Crear el enlace de Stripe (donde el diseñador llena sus datos)
        const accountLink = await stripe.accountLinks.create({
            account: user.stripeAccountId,
            refresh_url: `${process.env.FRONTEND_URL}/dashboard?stripe_callback=refresh`,
            return_url: `${process.env.FRONTEND_URL}/dashboard?stripe_callback=success`,
            type: 'account_onboarding',
        });

        res.status(200).json(ApiResponse.success('Enlace de onboarding listo', {
            url: accountLink.url
        }).toJSON());

    } catch (error) {
        console.log("Error detallado de Stripe:", error.message); // <--- Esto te dirá exactamente qué falta
        res.status(400).json({ success: false, message: error.message });
    }
});

// @desc    Verificar estado de la cuenta Connect y actualizar DB
// @route   GET /api/payments/designer/account-status
const getConnectAccountStatus = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user.stripeAccountId) {
        return res.status(200).json(ApiResponse.success('No tiene cuenta', { status: 'pending' }).toJSON());
    }

    // 1. Consultamos a Stripe el estado real
    const account = await stripe.accounts.retrieve(user.stripeAccountId);

    // 2. Verificamos si ya puede hacer cargos
    // account.details_submitted confirma que llenó el formulario
    // account.charges_enabled confirma que Stripe lo habilitó
    if (account.details_submitted && account.charges_enabled) {
        user.stripeAccountStatus = 'active';
        await user.save(); // ¡ESTA LÍNEA ES CLAVE!
    }

    res.status(200).json({
        success: true,
        status: user.stripeAccountStatus,
        details: {
            payouts_enabled: account.payouts_enabled,
            charges_enabled: account.charges_enabled
        }
    });
});

// ADMIN: Obtener proyectos que AÚN NO han sido liquidados al diseñador
const getPendingDesignerPayouts = asyncHandler(async (req, res) => {
    // Buscamos proyectos donde el diseñador no ha cobrado
    // Opcional: Podrías filtrar también por project.status === 'completed' 
    // si solo quieres pagar al terminar, o dejarlo abierto para adelantos.
    const projects = await Project.find({
        'designerView.isPaidToDesigner': false
    })
        .populate('designer', 'name email stripeAccountStatus')
        .sort({ createdAt: -1 });

    res.status(200).json(
        ApiResponse.success('Proyectos pendientes de liquidación obtenidos', { projects }).toJSON()
    );
});

// ADMIN: Obtener proyectos que YA fueron liquidados al diseñador
const getCompletedDesignerPayouts = asyncHandler(async (req, res) => {
    const projects = await Project.find({
        'designerView.isPaidToDesigner': true
    })
        .populate('designer', 'name email stripeAccountStatus')
        .sort({ 'designerView.paidAt': -1 }); // Los más recientes primero

    res.status(200).json(
        ApiResponse.success('Historial de liquidaciones obtenido', { projects }).toJSON()
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
    createConnectAccountLink,
    getConnectAccountStatus,
    getPendingDesignerPayouts,
    getCompletedDesignerPayouts
};
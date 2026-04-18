const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
    {
        // Usuario que paga (cliente o plataforma)
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        // Proyecto asociado (opcional)
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
        },
        // Cotización del cliente (si aplica)
        quote: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Quote',
        },
        // Cotización del diseñador (si aplica)
        designerQuote: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DesignerQuote',
        },
        // Monto en la moneda (ej. 100.00)
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        // Moneda (USD, EUR, etc.)
        currency: {
            type: String,
            default: 'EUR',
            uppercase: true,
        },
        // Tipo de pago
        type: {
            type: String,
            enum: ['client_payment', 'designer_payout', 'platform_fee', 'refund'],
            required: true,
        },
        // Estado del pago en Stripe
        status: {
            type: String,
            enum: ['pending', 'succeeded', 'failed', 'refunded', 'processing'],
            default: 'pending',
        },
        // ID de Stripe (PaymentIntent para cobros, Transfer para pagos a diseñadores)
        stripePaymentIntentId: {
            type: String,
        },
        stripeTransferId: {
            type: String,
        },
        // Para pagos a diseñadores: ID de la cuenta Connect del destinatario
        stripeDestinationAccount: {
            type: String,
        },
        // URL de la factura o recibo (opcional)
        invoiceUrl: String,
        receiptUrl: String,
        // Fecha en que se completó el pago
        paidAt: Date,
        // Metadatos adicionales
        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

// Índices
paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ project: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ stripePaymentIntentId: 1 });
paymentSchema.index({ stripeTransferId: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema(
    {
        request: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Request',
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        deadline: {
            type: Date,
        },
        description: {
            type: String,
            required: true,
            maxlength: 2000,
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected', 'expired'],
            default: 'pending',
        },
        clientNotes: {
            type: String,
            maxlength: 500,
        },
        adminNotes: {
            type: String,
            maxlength: 500,
        },
        validUntil: {
            type: Date,
        },
        acceptedAt: Date,
        rejectedAt: Date,
    },
    {
        timestamps: true,
    }
);

// Índices para consultas eficientes
quoteSchema.index({ request: 1, createdAt: -1 });
quoteSchema.index({ status: 1 });

const Quote = mongoose.model('Quote', quoteSchema);

module.exports = Quote;
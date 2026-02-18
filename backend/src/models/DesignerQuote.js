const mongoose = require('mongoose');

const designerQuoteSchema = new mongoose.Schema(
    {
        clientQuote: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Quote',
            required: true,
        },
        designer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        description: {
            type: String,
            required: true,
            maxlength: 2000,
        },
        deadline: {
            type: Date,
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected', 'expired'],
            default: 'pending',
        },
        adminNotes: String,
        designerNotes: String,
        acceptedAt: Date,
        rejectedAt: Date,
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('DesignerQuote', designerQuoteSchema);
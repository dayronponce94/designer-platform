const mongoose = require('mongoose');

const portfolioItemSchema = new mongoose.Schema(
    {
        designerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        title: {
            type: String,
            required: [true, 'Por favor ingrese un título'],
            trim: true,
            maxlength: [100, 'El título no puede exceder 100 caracteres']
        },
        description: {
            type: String,
            required: [true, 'Por favor ingrese una descripción'],
            maxlength: [500, 'La descripción no puede exceder 500 caracteres']
        },
        category: {
            type: String,
            enum: ['branding', 'ux-ui', 'graphic', 'web', 'motion', 'illustration', 'other'],
            required: true
        },
        tags: [{
            type: String,
            trim: true,
            maxlength: [20, 'Cada tag no puede exceder 20 caracteres']
        }],
        images: [{
            url: {
                type: String,
                required: true
            },
            filename: {
                type: String,
                required: true
            },
            isThumbnail: {
                type: Boolean,
                default: false
            },
            uploadedAt: {
                type: Date,
                default: Date.now
            }
        }],
        clientName: {
            type: String,
            trim: true,
            maxlength: [100, 'El nombre del cliente no puede exceder 100 caracteres']
        },
        projectDate: {
            type: Date
        },
        tools: [{
            type: String,
            trim: true
        }]
    },
    {
        timestamps: true
    }
);

// Índices para mejorar las consultas
portfolioItemSchema.index({ designerId: 1, createdAt: -1 });
portfolioItemSchema.index({ category: 1, createdAt: -1 });
portfolioItemSchema.index({ tags: 1 });



// Método para obtener datos públicos
portfolioItemSchema.methods.toPublicJSON = function () {
    const itemObject = this.toObject();

    // Eliminar campos internos
    delete itemObject.__v;

    return itemObject;
};

const PortfolioItem = mongoose.model('PortfolioItem', portfolioItemSchema);

module.exports = PortfolioItem;
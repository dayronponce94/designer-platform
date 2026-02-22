const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Por favor ingrese un título para la solicitud'],
            trim: true,
            maxlength: [100, 'El título no puede exceder 100 caracteres']
        },
        description: {
            type: String,
            required: [true, 'Por favor ingrese una descripción de la solicitud'],
            maxlength: [2000, 'La descripción no puede exceder 2000 caracteres']
        },
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        serviceType: {
            type: String,
            enum: ['branding', 'ux-ui', 'graphic', 'web', 'motion', 'illustration', 'other'],
            required: true
        },
        status: {
            type: String,
            enum: ['requested', 'quoted', 'cancelled'],
            default: 'requested'
        },
        attachments: [
            {
                url: String,
                filename: String,
                filetype: String,
                size: Number,
                uploadedAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
        budget: {
            type: Number,
            min: 0
        },
        deadline: {
            type: Date
        },
        references: {
            type: String,
            maxlength: [500, 'Las referencias no pueden exceder 500 caracteres']
        }
    },
    {
        timestamps: true
    }
);

// Índices para mejorar consultas
requestSchema.index({ client: 1, createdAt: -1 });
requestSchema.index({ status: 1 });

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
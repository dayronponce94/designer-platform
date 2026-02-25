const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Por favor ingrese un título para el proyecto'],
            trim: true,
            maxlength: [100, 'El título no puede exceder 100 caracteres']
        },
        description: {
            type: String,
            required: [true, 'Por favor ingrese una descripción del proyecto'],
            maxlength: [2000, 'La descripción no puede exceder 2000 caracteres']
        },
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        designer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true // Ahora es requerido porque el proyecto nace con un diseñador asignado
        },
        serviceType: {
            type: String,
            enum: ['branding', 'ux-ui', 'graphic', 'web', 'motion', 'illustration', 'other'],
            required: true
        },
        status: {
            type: String,
            // 'approved' es el estado inicial cuando el diseñador acepta la cotización
            enum: ['approved', 'in-progress', 'review', 'completed', 'cancelled'],
            default: 'approved'
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
            required: true // El presupuesto ya está definido por la cotización aceptada
        },
        deadline: {
            type: Date,
            required: true // El plazo ya está definido por la cotización del diseñador
        },
        // Referencia a la cotización que originó este proyecto
        designerQuote: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DesignerQuote',
            required: true
        },
        messages: [
            {
                sender: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                },
                message: String,
                attachments: [
                    {
                        url: String,
                        filename: String
                    }
                ],
                sentAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    },
    {
        timestamps: true
    },
);

projectSchema.index({ client: 1, createdAt: -1 });
projectSchema.index({ designer: 1, status: 1 });

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
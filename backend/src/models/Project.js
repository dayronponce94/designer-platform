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
            ref: 'User'
        },
        serviceType: {
            type: String,
            enum: ['branding', 'ux-ui', 'graphic', 'web', 'motion', 'other'],
            required: true
        },
        status: {
            type: String,
            enum: ['requested', 'quoted', 'approved', 'in-progress', 'review', 'completed', 'cancelled'],
            default: 'requested'
        },
        attachments: [
            {
                url: String,
                filename: String,
                uploadedAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
        budget: {
            type: Number,
            default: 0
        },
        deadline: {
            type: Date
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
    }
);

// Índices para mejorar las consultas
projectSchema.index({ client: 1, createdAt: -1 });
projectSchema.index({ designer: 1, status: 1 });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
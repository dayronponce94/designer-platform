const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
    {
        // --- Datos Generales e Identificación ---
        title: {
            type: String,
            required: true,
            trim: true
        },
        serviceType: {
            type: String,
            enum: ['branding', 'ux-ui', 'graphic', 'web', 'motion', 'illustration', 'other'],
            required: true
        },
        status: {
            type: String,
            enum: ['approved', 'in-progress', 'review', 'completed', 'cancelled'],
            default: 'approved'
        },

        // --- Referencias de Usuarios ---
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        designer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        references: {
            type: String,
            maxlength: [500]
        },

        // --- VISTA DEL CLIENTE (Snapshot de la Solicitud/Cotización Cliente) ---
        clientView: {
            description: String, // La descripción original del cliente
            budget: Number,      // Lo que el cliente pagó/pagará
            deadline: Date,      // La fecha prometida al cliente
            attachments: [       // Archivos originales de la solicitud
                {
                    url: String,
                    filename: String,
                    filetype: String,
                    size: Number,
                    uploadedAt: Date
                }
            ]
        },

        // --- VISTA DEL DISEÑADOR (Snapshot de la Cotización del Diseñador) ---
        designerView: {
            description: String, // Propuesta técnica o notas del diseñador
            earnings: Number,    // Lo que el diseñador recibirá netamente
            internalDeadline: Date, // Fecha de entrega con "colchón" (antes que la del cliente)
            isPaidToDesigner: { // Indica si el diseñador ya recibió su pago (para control interno)
                type: Boolean,
                default: false
            },
            paidAt: Date, // Fecha en que se realizó el pago al diseñador
            attachments: [       // Archivos de referencia que el diseñador subió en su quote
                {
                    url: String,
                    filename: String,
                    filetype: String,
                    size: Number,
                    uploadedAt: Date
                }
            ]
        },

        // --- ENTREGABLES FINALES (Importantísimo) ---
        deliverables: [
            {
                url: String,
                filename: String,
                filetype: String,
                size: Number,
                uploadedAt: { type: Date, default: Date.now },
                version: Number // Por si hay correcciones
            }
        ],

        // --- Historial y Mensajería ---
        designerQuote: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DesignerQuote',
            required: true
        },
        messages: [
            {
                sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                message: String,
                attachments: [{ url: String, filename: String }],
                sentAt: { type: Date, default: Date.now }
            }
        ]
    },
    {
        timestamps: true
    }
);

// Índices optimizados
projectSchema.index({ client: 1, status: 1 });
projectSchema.index({ designer: 1, status: 1 });

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
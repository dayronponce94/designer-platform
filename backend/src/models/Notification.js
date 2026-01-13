const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        type: {
            type: String,
            enum: [
                'project_assigned',      // Proyecto asignado (diseñador)
                'project_status_changed', // Estado cambiado (cliente)
                'project_created',       // Nuevo proyecto creado (admin/diseñador)
                'project_delivered',     // Entregable subido (cliente)
                'payment_confirmed',     // Pago confirmado
                'new_message',          // Nuevo mensaje
                'system'                // Notificación del sistema
            ],
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: [100, 'El título no puede exceder 100 caracteres']
        },
        message: {
            type: String,
            required: true,
            maxlength: [500, 'El mensaje no puede exceder 500 caracteres']
        },
        read: {
            type: Boolean,
            default: false
        },
        data: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },
        // Referencia opcional a proyecto relacionado
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project'
        },
        // Referencia opcional a usuario relacionado
        relatedUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true
    }
);

// Índices para optimizar consultas
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });
notificationSchema.index({ createdAt: -1 });

// Método para marcar como leída
notificationSchema.methods.markAsRead = function () {
    this.read = true;
    return this.save();
};

// Método estático para crear notificación
notificationSchema.statics.createNotification = async function (userId, type, title, message, data = {}, projectId = null, relatedUserId = null) {
    return await this.create({
        userId,
        type,
        title,
        message,
        data,
        projectId,
        relatedUserId
    });
};

// Método estático para obtener notificaciones no leídas de un usuario
notificationSchema.statics.getUnreadCount = async function (userId) {
    return await this.countDocuments({
        userId,
        read: false
    });
};

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
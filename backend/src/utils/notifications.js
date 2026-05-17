const Notification = require('../models/Notification');

class NotificationHelper {
    // Crear notificación de proyecto asignado (para diseñador)
    static async createProjectAssignedNotification(designerId, projectId, projectTitle, clientName) {
        return await Notification.createNotification(
            designerId,
            'project_assigned',
            '🎨 Nuevo proyecto asignado',
            `Se te ha asignado el proyecto "${projectTitle}" del cliente ${clientName}`,
            { projectTitle, clientName },
            projectId,
            null
        );
    }

    // Crear notificación de cambio de estado (para cliente)
    static async createProjectStatusNotification(clientId, projectId, projectTitle, oldStatus, newStatus) {
        const statusMessages = {
            'requested': 'solicitado',
            'quoted': 'cotizado',
            'approved': 'aprobado',
            'in-progress': 'en progreso',
            'review': 'en revisión',
            'completed': 'completado',
            'cancelled': 'cancelado'
        };

        return await Notification.createNotification(
            clientId,
            'project_status_changed',
            '🔄 Estado del proyecto actualizado',
            `El proyecto "${projectTitle}" ha cambiado de ${statusMessages[oldStatus]} a ${statusMessages[newStatus]}`,
            { projectTitle, oldStatus, newStatus },
            projectId,
            null
        );
    }

    // Crear notificación de nuevo mensaje
    static async createNewMessageNotification(receiverId, senderId, senderName, projectId, projectTitle) {
        return await Notification.createNotification(
            receiverId,
            'new_message',
            '✉️ Nuevo mensaje',
            `Tienes un nuevo mensaje de ${senderName} sobre el proyecto "${projectTitle}"`,
            { senderName, projectTitle },
            projectId,
            senderId
        );
    }

    // Crear notificación de pago confirmado
    static async createPaymentConfirmedNotification(userId, projectId, projectTitle, amount) {
        return await Notification.createNotification(
            userId,
            'payment_confirmed',
            '💰 Pago confirmado',
            `Se ha confirmado el pago de $${amount} por el proyecto "${projectTitle}"`,
            { projectTitle, amount },
            projectId,
            null
        );
    }

    // Crear notificación de entregable subido (para cliente)
    static async createProjectDeliveredNotification(clientId, projectId, projectTitle, designerName) {
        return await Notification.createNotification(
            clientId,
            'project_delivered',
            '📤 Nuevo entregable',
            `${designerName} ha subido un entregable para el proyecto "${projectTitle}"`,
            { designerName, projectTitle },
            projectId,
            null
        );
    }

    // Método genérico para disparar notificaciones rápidas sin crear métodos específicos
    static async trigger(userId, { type, title, message, projectId = null, relatedUserId = null }) {
        return await Notification.createNotification(
            userId,
            type,
            title,
            message,
            {}, // data vacía por defecto
            projectId,
            relatedUserId
        );
    }

    // Crear notificación del sistema
    static async createSystemNotification(userId, title, message, data = {}) {
        return await Notification.createNotification(
            userId,
            'system',
            `🔔 ${title}`,
            message,
            data,
            null,
            null
        );
    }

    // Notificar a todos los administradores
    static async notifyAdmins(userModel, title, message, data = {}) {
        const admins = await userModel.find({ role: 'admin', isActive: true });

        const notifications = admins.map(admin =>
            this.createSystemNotification(admin._id, title, message, data)
        );

        return await Promise.all(notifications);
    }
}

module.exports = NotificationHelper;
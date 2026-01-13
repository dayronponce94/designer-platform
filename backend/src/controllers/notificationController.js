const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');

// @desc    Obtener notificaciones del usuario
// @route   GET /api/notifications
// @access  Privado
exports.getNotifications = asyncHandler(async (req, res, next) => {
    const { limit = 20, page = 1, unreadOnly = false } = req.query;
    const userId = req.user.id;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Construir query
    const query = { userId };
    if (unreadOnly === 'true') {
        query.read = false;
    }

    // Obtener notificaciones
    const notifications = await Notification.find(query)
        .populate('projectId', 'title')
        .populate('relatedUserId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    // Contar total y no leídas
    const total = await Notification.countDocuments({ userId });
    const unreadCount = await Notification.countDocuments({
        userId,
        read: false
    });

    res.json(new ApiResponse(
        'Notificaciones obtenidas exitosamente',
        {
            notifications,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            },
            unreadCount
        }
    ));
});

// @desc    Marcar notificación como leída
// @route   PATCH /api/notifications/:id/read
// @access  Privado
exports.markAsRead = asyncHandler(async (req, res, next) => {
    const notification = await Notification.findOne({
        _id: req.params.id,
        userId: req.user.id
    });

    if (!notification) {
        return res.status(404).json({
            success: false,
            message: 'Notificación no encontrada'
        });
    }

    notification.read = true;
    await notification.save();

    res.json(new ApiResponse('Notificación marcada como leída', notification));
});

// @desc    Marcar todas las notificaciones como leídas
// @route   PATCH /api/notifications/mark-all-read
// @access  Privado
exports.markAllAsRead = asyncHandler(async (req, res, next) => {
    const result = await Notification.updateMany(
        {
            userId: req.user.id,
            read: false
        },
        {
            read: true
        }
    );

    res.json(new ApiResponse(
        'Todas las notificaciones marcadas como leídas',
        { modifiedCount: result.modifiedCount }
    ));
});

// @desc    Eliminar notificación
// @route   DELETE /api/notifications/:id
// @access  Privado
exports.deleteNotification = asyncHandler(async (req, res, next) => {
    const notification = await Notification.findOneAndDelete({
        _id: req.params.id,
        userId: req.user.id
    });

    if (!notification) {
        return res.status(404).json({
            success: false,
            message: 'Notificación no encontrada'
        });
    }

    res.json(new ApiResponse('Notificación eliminada exitosamente', null));
});

// @desc    Eliminar todas las notificaciones leídas
// @route   DELETE /api/notifications/read
// @access  Privado
exports.deleteAllRead = asyncHandler(async (req, res, next) => {
    const result = await Notification.deleteMany({
        userId: req.user.id,
        read: true
    });

    res.json(new ApiResponse(
        'Notificaciones leídas eliminadas',
        { deletedCount: result.deletedCount }
    ));
});

// @desc    Obtener contador de notificaciones no leídas
// @route   GET /api/notifications/unread-count
// @access  Privado
exports.getUnreadCount = asyncHandler(async (req, res, next) => {
    const unreadCount = await Notification.getUnreadCount(req.user.id);

    res.json(new ApiResponse(
        'Contador obtenido exitosamente',
        { unreadCount }
    ));
});
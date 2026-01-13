const express = require('express');
const router = express.Router();
const {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllRead,
    getUnreadCount
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(protect);

router.route('/')
    .get(getNotifications);

router.route('/unread-count')
    .get(getUnreadCount);

router.route('/mark-all-read')
    .patch(markAllAsRead);

router.route('/read')
    .delete(deleteAllRead);

router.route('/:id/read')
    .patch(markAsRead);

router.route('/:id')
    .delete(deleteNotification);

module.exports = router;
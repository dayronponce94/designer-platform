const express = require('express');
const router = express.Router();
const { register, login, logout, getMe, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Rutas públicas
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

// Rutas protegidas
router.get('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;
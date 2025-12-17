const express = require('express');
const router = express.Router();
const {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    getDesigners
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(protect);

// Rutas accesibles para admin
router.get('/', authorize('admin'), getUsers);
router.get('/designers', authorize('admin', 'designer'), getDesigners);
router.delete('/:id', authorize('admin'), deleteUser);

// Rutas accesibles para todos los usuarios autenticados
router.get('/:id', getUserById);
router.put('/:id', updateUser);

module.exports = router;
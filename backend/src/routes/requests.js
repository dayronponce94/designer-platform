const express = require('express');
const router = express.Router();
const {
    getRequests,
    getRequestById,
    createRequest,
    updateRequest,
    deleteRequest
} = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(protect);

// Rutas para clientes y admin
router.route('/')
    .get(getRequests)               // Cliente ve sus solicitudes, admin todas
    .post(authorize('client'), createRequest); // Solo clientes pueden crear

router.route('/:id')
    .get(getRequestById)
    .put(updateRequest)              // Cliente dueño (si requested) o admin
    .delete(deleteRequest);          // Cliente dueño (si requested) o admin

module.exports = router;
const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getUserStats,
    updateUser,
    deleteUser,
    getAllProjects,
    getDesignerPortfolio,
    getUserById,
    assignDesignerToProject,
    updateProjectStatus,
    getReports,
    createQuote,
    getAllQuotes,
    getQuoteById,
    createDesignerQuote,
    getAllDesignerQuotes,
    getAllRequests,
    getRequestById,
    updateRequestStatus,
    deleteRequest
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// Aplicar protección y rol de admin a todas las rutas
router.use(protect, authorize('admin'));

// Rutas de gestión de usuarios
router.route('/users')
    .get(getAllUsers);

router.route('/users/stats')
    .get(getUserStats);

router.route('/users/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);


// Rutas de gestión de proyectos
router.route('/projects')
    .get(getAllProjects);

router.route('/projects/:id/assign')
    .put(assignDesignerToProject);

router.route('/projects/:id/status')
    .put(updateProjectStatus);

// Rutas de cotizaciones
router.route('/projects/:projectId/quote')
    .post(createQuote);

// Rutas de reportes
router.route('/reports')
    .get(getReports);

// Ruta para obtener el portafolio de un diseñador
router.route('/designers/:id/portfolio')
    .get(getDesignerPortfolio);

// Cotizaciones de clientes
router.route('/quotes')
    .get(getAllQuotes);

router.route('/quotes/:id')
    .get(getQuoteById);

// Crear cotización de diseñador
router.route('/projects/:projectId/designer-quote')
    .post(createDesignerQuote);

// Cotizaciones de diseñadores
router.route('/designer-quotes')
    .get(getAllDesignerQuotes);

// Rutas para solicitudes (admin)
router.get('/requests', getAllRequests);
router.get('/requests/:id', getRequestById);
router.put('/requests/:id/status', updateRequestStatus);
router.delete('/requests/:id', deleteRequest);


module.exports = router;
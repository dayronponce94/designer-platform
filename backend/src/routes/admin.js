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
    getReports
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

// Rutas de reportes
router.route('/reports')
    .get(getReports);

// Agregar cerca de las otras rutas
router.route('/designers/:id/portfolio')
    .get(getDesignerPortfolio);

module.exports = router;
const express = require('express');
const router = express.Router();
const {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    addMessage,
    getDesignerDeadlines
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(protect);

router.route('/')
    .get(getProjects)
    .post(createProject);

// Nueva ruta para plazos de diseñadores
router.route('/designer/deadlines')
    .get(getDesignerDeadlines);

router.route('/:id')
    .get(getProjectById)
    .put(updateProject)
    .delete(deleteProject);

router.post('/:id/messages', addMessage);

module.exports = router;
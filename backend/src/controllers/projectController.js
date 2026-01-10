const Project = require('../models/Project');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Obtener proyectos del usuario (cliente o diseñador)
// @route   GET /api/projects
// @access  Private
const getProjects = asyncHandler(async (req, res) => {
    const { role } = req.user;
    let query;

    if (role === 'client') {
        query = { client: req.user.id };
    } else if (role === 'designer') {
        query = { designer: req.user.id };
    } else if (role === 'admin') {
        query = {};
    }

    const projects = await Project.find(query)
        .populate('client', 'name email')
        .populate('designer', 'name email')
        .sort({ createdAt: -1 });

    res.status(200).json(
        ApiResponse.success('Proyectos obtenidos', {
            projects,
            count: projects.length
        }).toJSON()
    );
});

// @desc    Obtener un proyecto por ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id)
        .populate('client', 'name email company phone')
        .populate('designer', 'name email specialty bio skills');

    if (!project) {
        return res.status(404).json(
            ApiResponse.notFound('Proyecto no encontrado').toJSON()
        );
    }

    // Verificar que el usuario tenga acceso al proyecto
    const { role, id: userId } = req.user;
    if (role === 'client' && project.client._id.toString() !== userId.toString()) {
        return res.status(403).json(
            ApiResponse.forbidden('No tienes acceso a este proyecto').toJSON()
        );
    }

    if (role === 'designer' && project.designer && project.designer._id.toString() !== userId.toString()) {
        return res.status(403).json(
            ApiResponse.forbidden('No tienes acceso a este proyecto').toJSON()
        );
    }

    res.status(200).json(
        ApiResponse.success('Proyecto obtenido', {
            project
        }).toJSON()
    );
});

// @desc    Crear un nuevo proyecto
// @route   POST /api/projects
// @access  Private (solo clientes)
const createProject = asyncHandler(async (req, res) => {
    const { title, description, serviceType, attachments } = req.body;

    // Solo los clientes pueden crear proyectos
    if (req.user.role !== 'client') {
        return res.status(403).json(
            ApiResponse.forbidden('Solo los clientes pueden crear proyectos').toJSON()
        );
    }

    const project = await Project.create({
        title,
        description,
        serviceType,
        client: req.user.id,
        attachments: attachments || []
    });

    const populatedProject = await Project.findById(project._id)
        .populate('client', 'name email');

    res.status(201).json(
        ApiResponse.success('Proyecto creado exitosamente', {
            project: populatedProject
        }, 201).toJSON()
    );
});

// @desc    Actualizar un proyecto
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = asyncHandler(async (req, res) => {
    let project = await Project.findById(req.params.id);

    if (!project) {
        return res.status(404).json(
            ApiResponse.notFound('Proyecto no encontrado').toJSON()
        );
    }

    // Verificar permisos
    const { role, id: userId } = req.user;
    const isClient = role === 'client' && project.client.toString() === userId.toString();
    const isDesigner = role === 'designer' && project.designer && project.designer.toString() === userId.toString();
    const isAdmin = role === 'admin';

    if (!isClient && !isDesigner && !isAdmin) {
        return res.status(403).json(
            ApiResponse.forbidden('No tienes permiso para actualizar este proyecto').toJSON()
        );
    }

    // Campos que se pueden actualizar
    const updatableFields = {};

    // Clientes pueden actualizar título, descripción, adjuntos
    if (isClient || isAdmin) {
        if (req.body.title) updatableFields.title = req.body.title;
        if (req.body.description) updatableFields.description = req.body.description;
        if (req.body.attachments) updatableFields.attachments = req.body.attachments;
    }

    // Diseñadores pueden actualizar estado y añadir mensajes
    if (isDesigner || isAdmin) {
        if (req.body.status) updatableFields.status = req.body.status;
    }

    // Admin puede asignar diseñador y presupuesto
    if (isAdmin) {
        if (req.body.designer) updatableFields.designer = req.body.designer;
        if (req.body.budget) updatableFields.budget = req.body.budget;
        if (req.body.deadline) updatableFields.deadline = req.body.deadline;
    }

    project = await Project.findByIdAndUpdate(
        req.params.id,
        updatableFields,
        { new: true, runValidators: true }
    )
        .populate('client', 'name email')
        .populate('designer', 'name email');

    res.status(200).json(
        ApiResponse.success('Proyecto actualizado', {
            project
        }).toJSON()
    );
});

// @desc    Eliminar un proyecto
// @route   DELETE /api/projects/:id
// @access  Private (solo admin o cliente dueño)
const deleteProject = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        return res.status(404).json(
            ApiResponse.notFound('Proyecto no encontrado').toJSON()
        );
    }

    // Verificar permisos: solo admin o cliente dueño
    const { role, id: userId } = req.user;
    const isOwner = project.client.toString() === userId.toString();

    if (!isOwner && role !== 'admin') {
        return res.status(403).json(
            ApiResponse.forbidden('No tienes permiso para eliminar este proyecto').toJSON()
        );
    }

    await project.deleteOne();

    res.status(200).json(
        ApiResponse.success('Proyecto eliminado').toJSON()
    );
});

// @desc    Añadir mensaje a un proyecto
// @route   POST /api/projects/:id/messages
// @access  Private
const addMessage = asyncHandler(async (req, res) => {
    const { message, attachments } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
        return res.status(404).json(
            ApiResponse.notFound('Proyecto no encontrado').toJSON()
        );
    }

    // Verificar que el usuario tenga acceso al proyecto
    const { role, id: userId } = req.user;
    const isClient = role === 'client' && project.client.toString() === userId.toString();
    const isDesigner = role === 'designer' && project.designer && project.designer.toString() === userId.toString();
    const isAdmin = role === 'admin';

    if (!isClient && !isDesigner && !isAdmin) {
        return res.status(403).json(
            ApiResponse.forbidden('No tienes acceso a este proyecto').toJSON()
        );
    }

    const newMessage = {
        sender: userId,
        message,
        attachments: attachments || []
    };

    project.messages.push(newMessage);
    await project.save();

    const updatedProject = await Project.findById(project._id)
        .populate('messages.sender', 'name email role');

    res.status(201).json(
        ApiResponse.success('Mensaje enviado', {
            project: updatedProject
        }, 201).toJSON()
    );
});

module.exports = {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    addMessage
};
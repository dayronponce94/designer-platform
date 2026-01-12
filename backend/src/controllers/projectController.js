const Project = require('../models/Project');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configurar almacenamiento para archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/projects';
        // Crear directorio si no existe
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB límite
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx|psd|ai|xd|fig|sketch|zip|rar/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Tipo de archivo no permitido'));
    }
}).array('attachments', 10); // Máximo 10 archivos

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
    // Usar multer para procesar archivos
    upload(req, res, async function (err) {
        if (err) {
            return res.status(400).json(
                ApiResponse.error(err.message, 400).toJSON()
            );
        }

        try {
            const { title, description, serviceType, budget, deadline, references } = req.body;

            // Solo los clientes pueden crear proyectos
            if (req.user.role !== 'client') {
                return res.status(403).json(
                    ApiResponse.forbidden('Solo los clientes pueden crear proyectos').toJSON()
                );
            }

            // Procesar archivos subidos
            const attachments = [];
            if (req.files && req.files.length > 0) {
                req.files.forEach(file => {
                    const env = require('../config/env');

                    attachments.push({
                        url: `${env.SERVER_URL}/uploads/projects/${file.filename}`,
                        filename: file.originalname,
                        filetype: file.mimetype,
                        size: file.size,
                        uploadedAt: new Date()
                    });
                });
            }

            const project = await Project.create({
                title,
                description,
                serviceType,
                budget: budget ? parseInt(budget) : null,
                deadline: deadline || null,
                references: references || '',
                client: req.user.id,
                attachments
            });

            const populatedProject = await Project.findById(project._id)
                .populate('client', 'name email company phone');

            res.status(201).json(
                ApiResponse.success('Proyecto creado exitosamente', {
                    project: populatedProject
                }, 201).toJSON()
            );

        } catch (error) {
            console.error('Error al crear proyecto:', error);
            res.status(500).json(
                ApiResponse.error('Error interno del servidor', 500).toJSON()
            );
        }
    });
});

// @desc    Actualizar un proyecto
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = asyncHandler(async (req, res) => {
    // Usar multer para procesar archivos (misma configuración que createProject)
    upload(req, res, async function (err) {
        if (err) {
            return res.status(400).json(
                ApiResponse.error(err.message, 400).toJSON()
            );
        }

        try {
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
            const { title, description, serviceType, budget, deadline, references } = req.body;

            // Clientes pueden actualizar título, descripción, tipo de servicio, referencias
            if (isClient || isAdmin) {
                if (title) updatableFields.title = title;
                if (description) updatableFields.description = description;
                if (serviceType) updatableFields.serviceType = serviceType;
                if (references !== undefined) updatableFields.references = references;
            }

            // Diseñadores pueden actualizar estado
            if (isDesigner || isAdmin) {
                if (req.body.status) updatableFields.status = req.body.status;
            }

            // Admin puede asignar diseñador y presupuesto
            if (isAdmin) {
                if (req.body.designer) updatableFields.designer = req.body.designer;
                if (budget) updatableFields.budget = parseFloat(budget);
                if (deadline) updatableFields.deadline = deadline;
            }

            // Procesar archivos nuevos
            const newAttachments = [];
            if (req.files && req.files.length > 0) {
                req.files.forEach(file => {
                    newAttachments.push({
                        url: `/uploads/projects/${file.filename}`,
                        filename: file.originalname,
                        filetype: file.mimetype,
                        size: file.size,
                        uploadedAt: new Date()
                    });
                });
            }

            // Procesar archivos a eliminar (de req.body)
            let attachmentsToRemove = [];
            if (req.body.removeAttachments) {
                attachmentsToRemove = Array.isArray(req.body.removeAttachments)
                    ? req.body.removeAttachments
                    : [req.body.removeAttachments];
            }

            // Actualizar archivos del proyecto
            if (newAttachments.length > 0 || attachmentsToRemove.length > 0) {
                // Filtrar archivos existentes (eliminar los marcados)
                const existingAttachments = project.attachments.filter(
                    att => !attachmentsToRemove.includes(att.url)
                );

                // Agregar nuevos archivos
                updatableFields.attachments = [...existingAttachments, ...newAttachments];
            }

            // Aplicar actualizaciones
            project = await Project.findByIdAndUpdate(
                req.params.id,
                { ...updatableFields, updatedAt: Date.now() },
                { new: true, runValidators: true }
            )
                .populate('client', 'name email company phone')
                .populate('designer', 'name email specialty bio skills portfolio');

            res.status(200).json(
                ApiResponse.success('Proyecto actualizado', {
                    project
                }).toJSON()
            );

        } catch (error) {
            console.error('Error al actualizar proyecto:', error);
            res.status(500).json(
                ApiResponse.error('Error interno del servidor', 500).toJSON()
            );
        }
    });
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
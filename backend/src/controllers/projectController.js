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
    const { role, id: userId } = req.user;
    // 1. Capturar query params
    const { status, search, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let query = {};

    // 2. Filtro base por Rol
    if (role === 'client') {
        query.client = userId;
    } else if (role === 'designer') {
        query.designer = userId;
    }

    // 3. Filtro de Estado (Si el usuario selecciona uno)
    if (status && status !== '' && status !== 'all' && status !== 'active') {
        // Si el frontend envía un estado real de DB (ej. 'completed'), filtramos por él
        query.status = status;
    } else if (role === 'designer' && status === 'active') {
        // Solo filtramos si el frontend explícitamente pide 'active'
        query.status = { $in: ['approved', 'in-progress', 'review'] };
    }


    // 4. Filtro de Búsqueda (Search)
    if (search && search.trim() !== '') {
        query.title = { $regex: search, $options: 'i' };
    }

    // 5. Ejecutar consulta con paginación
    const projects = await Project.find(query)
        .populate('designerQuote', 'description')
        .populate('client', 'name email company')
        .populate('designer', 'name email specialty')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

    // 6. Contar total para la paginación del frontend
    const total = await Project.countDocuments(query);

    const formattedProjects = projects.map(proj => {
        const p = proj.toObject();
        return {
            ...p,
            displayBudget: role === 'designer' ? p.designerView?.earnings : p.clientView?.budget,
            displayDeadline: role === 'designer' ? p.designerView?.internalDeadline : p.clientView?.deadline
        };
    });

    res.status(200).json(
        ApiResponse.success('Proyectos obtenidos', {
            projects: formattedProjects,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit))
            }
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
        return res.status(404).json(ApiResponse.notFound('Proyecto no encontrado').toJSON());
    }

    const { role, id: userId } = req.user;
    const isClient = project.client._id.toString() === userId.toString();
    const isDesigner = project.designer && project.designer._id.toString() === userId.toString();
    const isAdmin = role === 'admin';

    if (!isClient && !isDesigner && !isAdmin) {
        return res.status(403).json(ApiResponse.forbidden('No tienes acceso a este proyecto').toJSON());
    }

    // --- FILTRADO DE SEGURIDAD POR ROL ---
    let projectData = project.toObject();

    if (role === 'client') {
        // El cliente no debe ver las ganancias netas del diseñador ni la fecha interna
        if (projectData.designerView) {
            delete projectData.designerView.earnings;
            delete projectData.designerView.internalDeadline;
        }

    } else if (role === 'designer') {
        // El diseñador no debe ver cuánto pagó el cliente a la plataforma
        delete projectData.clientView.budget;
    }
    // El Admin lo ve todo.

    res.status(200).json(
        ApiResponse.success('Proyecto obtenido', { project: projectData }).toJSON()
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
    upload(req, res, async function (err) {
        if (err) return res.status(400).json(ApiResponse.error(err.message, 400).toJSON());

        try {
            let project = await Project.findById(req.params.id);
            if (!project) return res.status(404).json(ApiResponse.notFound('Proyecto no encontrado').toJSON());

            const oldStatus = project.status;
            const { role, id: userId } = req.user;
            const isAdmin = role === 'admin';
            const isDesigner = role === 'designer' && project.designer?.toString() === userId.toString();

            // Bloqueo de cancelación para proyectos completados
            if (req.body.status === 'cancelled' && oldStatus === 'completed') {
                return res.status(400).json(ApiResponse.error('No se puede cancelar un proyecto completado', 400).toJSON());
            }

            const updatableFields = {};
            const { status, title, clientBudget, designerEarnings, clientDeadline, internalDeadline } = req.body;

            // Actualización de Estado (Diseñador o Admin)
            if (isDesigner || isAdmin) {
                if (status) updatableFields.status = status;
            }

            // Solo Admin puede tocar dinero y fechas de ambos lados
            if (isAdmin) {
                if (title) updatableFields.title = title;
                if (clientBudget) updatableFields['clientView.budget'] = clientBudget;
                if (designerEarnings) updatableFields['designerView.earnings'] = designerEarnings;
                if (clientDeadline) updatableFields['clientView.deadline'] = clientDeadline;
                if (internalDeadline) updatableFields['designerView.internalDeadline'] = internalDeadline;
            }

            // Lógica de archivos (mantenemos la que ya tenías pero apuntando a deliverables si es entrega)
            if (req.files && req.files.length > 0) {
                const newFiles = req.files.map(file => ({
                    url: `${process.env.SERVER_URL || ''}/uploads/projects/${file.filename}`,
                    filename: file.originalname,
                    filetype: file.mimetype,
                    size: file.size,
                    uploadedAt: new Date()
                }));
                // Si el diseñador sube algo y el estado es 'review', lo mandamos a entregables
                if (isDesigner && status === 'review') {
                    updatableFields.deliverables = [...(project.deliverables || []), ...newFiles];
                } else {
                    updatableFields['clientView.attachments'] = [...project.clientView.attachments, ...newFiles];
                }
            }

            project = await Project.findByIdAndUpdate(
                req.params.id,
                { $set: updatableFields, updatedAt: Date.now() },
                { new: true, runValidators: true }
            ).populate('client designer', 'name email');

            // ... (El bloque de notificaciones que ya teníamos se mantiene igual) ...

            res.status(200).json(ApiResponse.success('Proyecto actualizado', { project }).toJSON());
        } catch (error) {
            res.status(500).json(ApiResponse.error('Error al actualizar', 500).toJSON());
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

// @desc    Obtener plazos de proyectos para diseñador
// @route   GET /api/projects/designer/deadlines
// @access  Private (solo diseñadores)
const getDesignerDeadlines = asyncHandler(async (req, res) => {
    if (req.user.role !== 'designer') {
        return res.status(403).json(ApiResponse.forbidden('Acceso solo para diseñadores').toJSON());
    }

    // Capturamos el status si viene de la query (opcional, pero útil)
    const { status } = req.query;

    let query = { designer: req.user.id };

    // Si NO viene un status específico, por defecto mostramos lo pendiente.
    // Si viene 'all', no agregamos filtro de status (trae todo).
    if (status === 'active') {
        query.status = { $nin: ['completed', 'cancelled'] };
    } else if (status && status !== 'all') {
        query.status = status;
    }

    const projects = await Project.find(query)
        .populate('client', 'name company')
        .sort({ 'designerView.internalDeadline': 1 });

    // 2. Ajustamos el mapeo para incluir TODO lo que tu interfaz de React espera
    const formatted = projects.map(p => ({
        _id: p._id,
        title: p.title,
        status: p.status,
        serviceType: p.serviceType,
        // Datos de la vista de diseñador
        designerView: p.designerView,
        // Datos del cliente
        client: p.client,
        // Mantenemos estas aliadas para compatibilidad con tu Hook
        deadline: p.designerView?.internalDeadline,
        budget: p.designerView?.earnings || 0,
        description: p.designerView?.description
    }));

    res.status(200).json(ApiResponse.success('Plazos obtenidos', { projects: formatted }).toJSON());
});

// @desc    Subir un entregable a un proyecto (diseñador)
// @route   POST /api/projects/:id/deliverables
// @access  Private (solo diseñador asignado)
const uploadDeliverable = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (!project) {
        return res.status(404).json(ApiResponse.notFound('Proyecto no encontrado').toJSON());
    }

    // Verificar que el usuario sea el diseñador asignado
    if (project.designer.toString() !== req.user.id) {
        return res.status(403).json(ApiResponse.forbidden('No eres el diseñador asignado a este proyecto').toJSON());
    }

    // Configurar multer para un solo archivo
    const uploadSingle = multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                const dir = 'uploads/deliverables';
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
                cb(null, dir);
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                cb(null, 'deliverable-' + uniqueSuffix + path.extname(file.originalname));
            }
        }),
        limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
        fileFilter: (req, file, cb) => {
            const allowedExtensions = /\.(zip|rar|7z|tar\.gz|gz)$/i;
            if (!allowedExtensions.test(file.originalname)) {
                return cb(new Error('Solo se permiten archivos comprimidos (.zip, .rar, .7z, .tar.gz)'), false);
            }
            cb(null, true);
        }
    }).single('deliverable');

    uploadSingle(req, res, async (err) => {
        if (err) {
            return res.status(400).json(ApiResponse.error(err.message, 400).toJSON());
        }
        if (!req.file) {
            return res.status(400).json(ApiResponse.error('Debe seleccionar un archivo', 400).toJSON());
        }

        const { version, notes } = req.body;
        const env = require('../config/env');

        const deliverable = {
            url: `${env.SERVER_URL}/uploads/deliverables/${req.file.filename}`,
            filename: req.file.originalname,
            filetype: req.file.mimetype,
            size: req.file.size,
            uploadedAt: new Date(),
            version: version ? parseInt(version) : (project.deliverables.length + 1)
        };

        project.deliverables.push(deliverable);

        // Si el proyecto estaba en 'approved' o 'in-progress', pasar a 'review'
        if (['approved', 'in-progress'].includes(project.status)) {
            project.status = 'review';
        }

        await project.save();

        res.status(201).json(
            ApiResponse.success('Entregable subido correctamente', { deliverable }).toJSON()
        );
    });
});

module.exports = {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    addMessage,
    getDesignerDeadlines,
    uploadDeliverable
};
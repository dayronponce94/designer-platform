const Request = require('../models/Request');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const env = require('../config/env');
const NotificationHelper = require('../utils/notifications');
const User = require('../models/User');

// Configurar almacenamiento para archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/requests';
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
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
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

// @desc    Obtener solicitudes del usuario (cliente) o todas (admin)
// @route   GET /api/requests
// @access  Private
const getRequests = asyncHandler(async (req, res) => {
    const { role, id: userId } = req.user;
    // 1. Extraemos 'search' de la query
    const { page = 1, limit = 3, status, search } = req.query;

    let query = {};
    if (role === 'client') {
        query.client = userId;
    } else if (role !== 'admin') {
        return res.status(403).json(ApiResponse.forbidden('No tienes permiso').toJSON());
    }

    // 2. Filtro por estado
    if (status && status !== 'all' && status !== '') {
        query.status = status;
    }

    // 3. NUEVO: Filtro por búsqueda (Título del proyecto)
    if (search) {
        // 'i' hace que sea "case-insensitive" (no importa mayúsculas/minúsculas)
        query.title = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;

    const [requests, total] = await Promise.all([
        Request.find(query)
            .populate('client', 'name email company')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),
        Request.countDocuments(query)
    ]);

    res.status(200).json(
        ApiResponse.success('Solicitudes obtenidas', {
            requests,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / limit)
            }
        }).toJSON()
    );
});

// @desc    Obtener una solicitud por ID
// @route   GET /api/requests/:id
// @access  Private
const getRequestById = asyncHandler(async (req, res) => {
    const request = await Request.findById(req.params.id)
        .populate('client', 'name email company phone');

    if (!request) {
        return res.status(404).json(
            ApiResponse.notFound('Solicitud no encontrada').toJSON()
        );
    }

    // Verificar acceso
    const { role, id: userId } = req.user;
    if (role === 'client' && request.client._id.toString() !== userId.toString()) {
        return res.status(403).json(
            ApiResponse.forbidden('No tienes acceso a esta solicitud').toJSON()
        );
    }
    // Admin tiene acceso total (ya verificado por la ruta)

    res.status(200).json(
        ApiResponse.success('Solicitud obtenida', {
            request
        }).toJSON()
    );
});

// @desc    Crear una nueva solicitud
// @route   POST /api/requests
// @access  Private (solo clientes)
const createRequest = asyncHandler(async (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            return res.status(400).json(
                ApiResponse.error(err.message, 400).toJSON()
            );
        }

        try {
            // Solo clientes pueden crear solicitudes
            if (req.user.role !== 'client') {
                return res.status(403).json(
                    ApiResponse.forbidden('Solo los clientes pueden crear solicitudes').toJSON()
                );
            }

            const { title, description, serviceType, budget, deadline, references } = req.body;

            // Procesar archivos subidos
            const attachments = [];
            if (req.files && req.files.length > 0) {
                req.files.forEach(file => {
                    attachments.push({
                        url: `${env.SERVER_URL}/uploads/requests/${file.filename}`,
                        filename: file.originalname,
                        filetype: file.mimetype,
                        size: file.size,
                        uploadedAt: new Date()
                    });
                });
            }

            const request = await Request.create({
                title,
                description,
                serviceType,
                budget: budget ? parseFloat(budget) : undefined,
                deadline: deadline || undefined,
                references: references || '',
                client: req.user.id,
                attachments,
                status: 'requested'
            });

            const populatedRequest = await Request.findById(request._id)
                .populate('client', 'name email company phone');

            // Notificar a los administradores sobre la nueva solicitud
            await NotificationHelper.notifyAdmins(
                User,
                'Nueva Solicitud de Proyecto',
                `El cliente ${req.user.name} ha creado una nueva solicitud: "${title}".`
            );

            res.status(201).json(
                ApiResponse.success('Solicitud creada exitosamente', {
                    request: populatedRequest
                }, 201).toJSON()
            );

        } catch (error) {
            console.error('Error al crear solicitud:', error);
            res.status(500).json(
                ApiResponse.error('Error interno del servidor', 500).toJSON()
            );
        }
    });
});

// @desc    Actualizar una solicitud
// @route   PUT /api/requests/:id
// @access  Private (solo cliente dueño si está en requested)
const updateRequest = asyncHandler(async (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            return res.status(400).json(
                ApiResponse.error(err.message, 400).toJSON()
            );
        }

        try {
            let request = await Request.findById(req.params.id);

            if (!request) {
                return res.status(404).json(
                    ApiResponse.notFound('Solicitud no encontrada').toJSON()
                );
            }

            // Verificar permisos: solo cliente dueño y estado requested, o admin
            const { role, id: userId } = req.user;
            const isOwner = role === 'client' && request.client.toString() === userId.toString();
            const isAdmin = role === 'admin';

            if (!isOwner && !isAdmin) {
                return res.status(403).json(
                    ApiResponse.forbidden('No tienes permiso para actualizar esta solicitud').toJSON()
                );
            }

            // Si es cliente, solo puede editar si está en requested
            if (isOwner && request.status !== 'requested') {
                return res.status(400).json(
                    ApiResponse.error('No puedes editar una solicitud que ya ha sido cotizada o cancelada', 400).toJSON()
                );
            }

            // Campos permitidos para actualizar
            const updatableFields = {};
            const { title, description, serviceType, budget, deadline, references, status } = req.body;

            if (title) updatableFields.title = title;
            if (description) updatableFields.description = description;
            if (serviceType) updatableFields.serviceType = serviceType;
            if (budget !== undefined) updatableFields.budget = parseFloat(budget);
            if (deadline) updatableFields.deadline = deadline;
            if (references !== undefined) updatableFields.references = references;

            // Solo admin puede cambiar el estado
            if (isAdmin && status && ['requested', 'quoted', 'cancelled'].includes(status)) {
                updatableFields.status = status;
            }

            // Procesar archivos nuevos
            const newAttachments = [];
            if (req.files && req.files.length > 0) {
                req.files.forEach(file => {
                    newAttachments.push({
                        url: `${env.SERVER_URL}/uploads/requests/${file.filename}`,
                        filename: file.originalname,
                        filetype: file.mimetype,
                        size: file.size,
                        uploadedAt: new Date()
                    });
                });
            }

            // Procesar archivos a eliminar
            let attachmentsToRemove = [];
            if (req.body.removeAttachments) {
                attachmentsToRemove = Array.isArray(req.body.removeAttachments)
                    ? req.body.removeAttachments
                    : [req.body.removeAttachments];
            }

            // Actualizar archivos
            if (newAttachments.length > 0 || attachmentsToRemove.length > 0) {
                const existingAttachments = request.attachments.filter(
                    att => !attachmentsToRemove.includes(att.url)
                );
                updatableFields.attachments = [...existingAttachments, ...newAttachments];
            }

            request = await Request.findByIdAndUpdate(
                req.params.id,
                { ...updatableFields, updatedAt: Date.now() },
                { new: true, runValidators: true }
            ).populate('client', 'name email company phone');

            // Notificar a los administradores sobre la actualización de la solicitud (solo si el cliente es quien edita)
            if (req.user.role === 'client') {
                await NotificationHelper.notifyAdmins(
                    User,
                    'Solicitud Actualizada',
                    `El cliente ${req.user.name} ha modificado la solicitud: "${request.title}".`
                );
            }

            res.status(200).json(
                ApiResponse.success('Solicitud actualizada', {
                    request
                }).toJSON()
            );

        } catch (error) {
            console.error('Error al actualizar solicitud:', error);
            res.status(500).json(
                ApiResponse.error('Error interno del servidor', 500).toJSON()
            );
        }
    });
});

// @desc    Eliminar una solicitud
// @route   DELETE /api/requests/:id
// @access  Private (solo cliente dueño si está en requested, o admin)
const deleteRequest = asyncHandler(async (req, res) => {
    const request = await Request.findById(req.params.id);

    if (!request) {
        return res.status(404).json(
            ApiResponse.notFound('Solicitud no encontrada').toJSON()
        );
    }

    const { role, id: userId } = req.user;
    const isOwner = role === 'client' && request.client.toString() === userId.toString();
    const isAdmin = role === 'admin';

    if (!isOwner && !isAdmin) {
        return res.status(403).json(
            ApiResponse.forbidden('No tienes permiso para eliminar esta solicitud').toJSON()
        );
    }

    // Si es cliente, solo puede eliminar si está en requested
    if (isOwner && request.status !== 'requested') {
        return res.status(400).json(
            ApiResponse.error('No puedes eliminar una solicitud que ya ha sido cotizada o cancelada', 400).toJSON()
        );
    }

    // Notificar a los administradores sobre la eliminación de la solicitud
    await NotificationHelper.notifyAdmins(
        User,
        'Solicitud Eliminada',
        `El cliente ${req.user.name} ha eliminado su solicitud: "${request.title}".`
    );

    await request.deleteOne();

    res.status(200).json(
        ApiResponse.success('Solicitud eliminada').toJSON()
    );
});

module.exports = {
    getRequests,
    getRequestById,
    createRequest,
    updateRequest,
    deleteRequest
};
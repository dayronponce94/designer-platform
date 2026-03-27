const User = require('../models/User');
const Project = require('../models/Project');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const mongoose = require('mongoose');
const Portfolio = require('../models/Portfolio');
const Quote = require('../models/Quote');
const DesignerQuote = require('../models/DesignerQuote');
const Request = require('../models/Request');


// @desc    Obtener todos los usuarios
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
    const { role, isActive, isVerified, search, page = 1, limit = 20 } = req.query;

    let query = {};

    // Filtros - solo aplicar si no están vacíos
    if (role && role.trim() !== '') {
        query.role = role;
    }

    if (isActive !== undefined && isActive !== '') {
        // Convertir string a booleano
        if (isActive === 'true') {
            query.isActive = true;
        } else if (isActive === 'false') {
            query.isActive = false;
        }
        // Si es 'all' o vacío, no aplicar filtro
    }

    if (isVerified !== undefined && isVerified !== '') {
        // Convertir string a booleano
        if (isVerified === 'true') {
            query.isVerified = true;
        } else if (isVerified === 'false') {
            query.isVerified = false;
        }
        // Si es 'all' o vacío, no aplicar filtro
    }

    // Búsqueda por texto
    if (search && search.trim() !== '') {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { company: { $regex: search, $options: 'i' } }
        ];
    }

    // Paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json(
        ApiResponse.success('Usuarios obtenidos', {
            users,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        }).toJSON()
    );
});

// @desc    Obtener estadísticas de usuarios
// @route   GET /api/admin/users/stats
// @access  Private/Admin
const getUserStats = asyncHandler(async (req, res) => {
    const stats = await User.aggregate([
        {
            $group: {
                _id: '$role',
                count: { $sum: 1 },
                verified: {
                    $sum: { $cond: [{ $eq: ['$isVerified', true] }, 1, 0] }
                },
                active: {
                    $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
                }
            }
        },
        {
            $project: {
                role: '$_id',
                count: 1,
                verified: 1,
                active: 1,
                _id: 0
            }
        }
    ]);

    // Calcular totales
    const totalUsers = await User.countDocuments();
    const totalVerified = await User.countDocuments({ isVerified: true });
    const totalActive = await User.countDocuments({ isActive: true });

    res.status(200).json(
        ApiResponse.success('Estadísticas obtenidas', {
            stats,
            totals: {
                users: totalUsers,
                verified: totalVerified,
                active: totalActive
            }
        }).toJSON()
    );
});

// @desc    Actualizar usuario (admin puede editar todo)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    const { name, company, phone, bio, specialty, experience, skills, portfolio,
        isActive, isVerified, role } = req.body;

    // No permitir modificar rol o estado del admin principal
    if (req.params.id === req.user.id && (isActive === false || (role && role !== 'admin'))) {
        return res.status(400).json(
            ApiResponse.error('No puedes desactivar o cambiar el rol de tu propia cuenta de administrador', 400).toJSON()
        );
    }

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (company !== undefined) updates.company = company;
    if (phone !== undefined) updates.phone = phone;
    if (bio !== undefined) updates.bio = bio;
    if (specialty !== undefined) updates.specialty = specialty;
    if (experience !== undefined) updates.experience = experience;
    if (skills !== undefined) updates.skills = skills;
    if (portfolio !== undefined) updates.portfolio = portfolio;

    if (isActive !== undefined) updates.isActive = isActive;
    if (isVerified !== undefined) updates.isVerified = isVerified;
    if (role && ['client', 'designer', 'admin'].includes(role)) updates.role = role;

    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: updates },
        { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
        return res.status(404).json(ApiResponse.notFound('Usuario no encontrado').toJSON());
    }

    res.status(200).json(
        ApiResponse.success('Usuario actualizado correctamente', { user: updatedUser }).toJSON()
    );
});

// @desc    Obtener todos los proyectos (vista admin)
// @route   GET /api/admin/projects
// @access  Private/Admin
const getAllProjects = asyncHandler(async (req, res) => {
    const { status, serviceType, hasDesigner, startDate, endDate, search, page = 1, limit = 20 } = req.query;

    let query = {};

    // Filtros
    if (status) query.status = status;
    if (serviceType) query.serviceType = serviceType;
    if (hasDesigner === 'true') query.designer = { $exists: true, $ne: null };
    if (hasDesigner === 'false') query.designer = { $exists: false };

    // Filtro por fecha
    if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Búsqueda por texto
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }

    // Paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const projects = await Project.find(query)
        .populate('client', 'name email company')
        .populate('designer', 'name email specialty')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const total = await Project.countDocuments(query);

    res.status(200).json(
        ApiResponse.success('Proyectos obtenidos', {
            projects,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        }).toJSON()
    );
});

// @desc    Asignar diseñador a proyecto
// @route   PUT /api/admin/projects/:id/assign
// @access  Private/Admin
const assignDesignerToProject = asyncHandler(async (req, res) => {
    const { designerId } = req.body;

    if (!designerId || !mongoose.Types.ObjectId.isValid(designerId)) {
        return res.status(400).json(
            ApiResponse.error('ID de diseñador inválido', 400).toJSON()
        );
    }

    // Verificar que el diseñador exista y sea diseñador
    const designer = await User.findOne({
        _id: designerId,
        role: 'designer',
        isActive: true
    });

    if (!designer) {
        return res.status(400).json(
            ApiResponse.error('Diseñador no encontrado o no disponible', 400).toJSON()
        );
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
        return res.status(404).json(
            ApiResponse.notFound('Proyecto no encontrado').toJSON()
        );
    }

    // Asignar diseñador y actualizar estado
    project.designer = designerId;
    project.status = 'approved'; // Cambiar a aprobado cuando se asigna diseñador

    await project.save();

    // Notificación para el diseñador (implementar después)
    // await createNotification({
    //     userId: designerId,
    //     type: 'project_assigned',
    //     title: 'Nuevo proyecto asignado',
    //     message: `Se te ha asignado el proyecto "${project.title}"`,
    //     projectId: project._id
    // });

    const updatedProject = await Project.findById(project._id)
        .populate('client', 'name email')
        .populate('designer', 'name email specialty');

    res.status(200).json(
        ApiResponse.success('Diseñador asignado al proyecto', {
            project: updatedProject
        }).toJSON()
    );
});

// @desc    Aprobar o cancelar proyecto
// @route   PUT /api/admin/projects/:id/status
// @access  Private/Admin
const updateProjectStatus = asyncHandler(async (req, res) => {
    const { status, reason } = req.body;

    if (!['approved', 'cancelled'].includes(status)) {
        return res.status(400).json(
            ApiResponse.error('Estado no válido. Use "approved" o "cancelled"', 400).toJSON()
        );
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
        return res.status(404).json(
            ApiResponse.notFound('Proyecto no encontrado').toJSON()
        );
    }

    // No permitir cancelar proyectos completados
    if (project.status === 'completed' && status === 'cancelled') {
        return res.status(400).json(
            ApiResponse.error('No se puede cancelar un proyecto ya completado', 400).toJSON()
        );
    }

    // Guardar estado anterior
    const previousStatus = project.status;

    // Actualizar estado
    project.status = status;
    if (status === 'cancelled' && reason) {
        project.cancellationReason = reason;
        project.cancelledAt = new Date();
    }

    await project.save();

    // Notificación al cliente (implementar después)
    // await createNotification({
    //     userId: project.client,
    //     type: 'project_status_changed',
    //     title: `Proyecto ${status === 'approved' ? 'aprobado' : 'cancelado'}`,
    //     message: `Tu proyecto "${project.title}" ha sido ${status === 'approved' ? 'aprobado' : 'cancelado'}`,
    //     projectId: project._id
    // });

    res.status(200).json(
        ApiResponse.success(`Proyecto ${status === 'approved' ? 'aprobado' : 'cancelado'}`, {
            project: {
                ...project.toObject(),
                previousStatus
            }
        }).toJSON()
    );
});

// @desc    Obtener reportes y estadísticas
// @route   GET /api/admin/reports
// @access  Private/Admin
const getReports = asyncHandler(async (req, res) => {
    const { period = 'month' } = req.query; // month, quarter, year

    // Proyectos por estado
    const projectsByStatus = await Project.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
                totalBudget: { $sum: '$budget' }
            }
        }
    ]);

    // Proyectos por mes (últimos 12 meses)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const projectsByMonth = await Project.aggregate([
        {
            $match: {
                createdAt: { $gte: twelveMonthsAgo }
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' }
                },
                count: { $sum: 1 },
                revenue: { $sum: '$budget' }
            }
        },
        {
            $sort: { '_id.year': 1, '_id.month': 1 }
        }
    ]);

    // Usuarios por mes (últimos 12 meses)
    const usersByMonth = await User.aggregate([
        {
            $match: {
                createdAt: { $gte: twelveMonthsAgo },
                role: { $ne: 'admin' } // Excluir admin
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                    role: '$role'
                },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { '_id.year': 1, '_id.month': 1 }
        }
    ]);

    // Estadísticas generales
    const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });
    const totalClients = await User.countDocuments({ role: 'client' });
    const totalDesigners = await User.countDocuments({ role: 'designer' });
    const totalProjects = await Project.countDocuments();
    const totalRevenue = await Project.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$budget' } } }
    ]);

    // Proyectos sin diseñador asignado
    const unassignedProjects = await Project.countDocuments({
        designer: { $exists: false },
        status: { $nin: ['cancelled', 'completed'] }
    });

    res.status(200).json(
        ApiResponse.success('Reportes obtenidos', {
            overview: {
                totalUsers,
                totalClients,
                totalDesigners,
                totalProjects,
                totalRevenue: totalRevenue[0]?.total || 0,
                unassignedProjects
            },
            projectsByStatus: projectsByStatus.map(item => ({
                status: item._id,
                count: item.count,
                totalBudget: item.totalBudget
            })),
            projectsByMonth: projectsByMonth.map(item => ({
                year: item._id.year,
                month: item._id.month,
                count: item.count,
                revenue: item.revenue
            })),
            usersByMonth: usersByMonth.map(item => ({
                year: item._id.year,
                month: item._id.month,
                role: item._id.role,
                count: item.count
            }))
        }).toJSON()
    );
});

// @desc    Eliminar usuario (con eliminación en cascada)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json(
            ApiResponse.notFound('Usuario no encontrado').toJSON()
        );
    }

    // Verificar que no sea el admin principal (Verónica Llerandi)
    if (user.email === 'verallero@gmail.com') {
        return res.status(400).json(
            ApiResponse.error('No se puede eliminar al administrador principal del sistema', 400).toJSON()
        );
    }

    // Verificar que no sea el usuario actual
    if (req.user.id === user._id.toString()) {
        return res.status(400).json(
            ApiResponse.error('No puedes eliminar tu propia cuenta', 400).toJSON()
        );
    }

    // Eliminación en cascada
    // 1. Proyectos donde el usuario es cliente
    await Project.deleteMany({ client: user._id });

    // 2. Proyectos donde el usuario es diseñador
    await Project.updateMany(
        { designer: user._id },
        { $set: { designer: null } }
    );

    // 3. Notificaciones relacionadas (si hay)
    // await Notification.deleteMany({ 
    //     $or: [
    //         { userId: user._id },
    //         { relatedUserId: user._id }
    //     ] 
    // });

    // 4. Elementos del portafolio (si es diseñador)
    if (user.role === 'designer') {
        await Portfolio.deleteMany({ designerId: user._id });
    }

    // 5. Finalmente eliminar el usuario
    await User.findByIdAndDelete(user._id);

    res.status(200).json(
        ApiResponse.success('Usuario eliminado exitosamente (con eliminación en cascada)').toJSON()
    );
});

// @desc    Obtener un usuario por ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
        return res.status(404).json(
            ApiResponse.notFound('Usuario no encontrado').toJSON()
        );
    }

    res.status(200).json(
        ApiResponse.success('Usuario encontrado', { user }).toJSON()
    );
});

// @desc    Obtener portafolio de un diseñador específico
// @route   GET /api/admin/designers/:id/portfolio
// @access  Private/Admin
const getDesignerPortfolio = asyncHandler(async (req, res) => {
    const designerId = req.params.id;

    // Verificar que el usuario sea un diseñador
    const designer = await User.findOne({
        _id: designerId,
        role: 'designer'
    }).select('-password');

    if (!designer) {
        return res.status(404).json(
            ApiResponse.notFound('Diseñador no encontrado').toJSON()
        );
    }

    // Obtener los items del portafolio del diseñador
    // Necesitamos el modelo Portfolio - asumo que existe
    const Portfolio = require('../models/Portfolio');

    const portfolioItems = await Portfolio.find({ designerId: designerId })
        .sort({ createdAt: -1 });

    res.status(200).json(
        ApiResponse.success('Portafolio obtenido', {
            designer: {
                _id: designer._id,
                name: designer.name,
                email: designer.email,
                specialty: designer.specialty,
                experience: designer.experience,
                bio: designer.bio,
                skills: designer.skills
            },
            portfolio: portfolioItems,
            count: portfolioItems.length
        }).toJSON()
    );
});

// @desc    Crear una cotización para una solicitud de proyecto
// @route   POST /api/admin/requests/:requestId/quote
// @access  Private/Admin
const createQuote = asyncHandler(async (req, res) => {
    const { requestId } = req.params;
    const { amount, deadline, description, adminNotes, validUntil } = req.body;

    // Validar solicitud
    const request = await Request.findById(requestId);
    if (!request) {
        return res.status(404).json(ApiResponse.notFound('Solicitud no encontrada').toJSON());
    }

    // Crear cotización
    const quote = await Quote.create({
        request: requestId,
        createdBy: req.user.id,
        amount,
        deadline,
        description,
        adminNotes,
        validUntil,
        status: 'pending',
    });

    // Actualizar estado de la solicitud a 'quoted' si no lo está
    if (request.status !== 'quoted') {
        request.status = 'quoted';
        await request.save();
    }

    // Opcional: enviar notificación al cliente
    // (Implementar después con NotificationHelper)

    res.status(201).json(
        ApiResponse.success('Cotización creada exitosamente', { quote }, 201).toJSON()
    );
});

// @desc    Obtener todas las cotizaciones de clientes
// @route   GET /api/admin/quotes
const getAllQuotes = asyncHandler(async (req, res) => {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    // Filtro por estado
    if (status) query.status = status;

    // Filtro por búsqueda (Proyecto o Cliente)
    if (search) {
        // Buscamos solicitudes (Request) que coincidan con el título
        const matchingRequests = await mongoose.model('Request').find({
            title: { $regex: search, $options: 'i' }
        }).select('_id');

        const requestIds = matchingRequests.map(r => r._id);

        // Filtramos las cotizaciones que pertenezcan a esas solicitudes
        query.request = { $in: requestIds };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const quotes = await Quote.find(query)
        .populate({
            path: 'request',
            select: 'title serviceType client',
            populate: {
                path: 'client',
                select: 'name email'
            }
        })
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const total = await Quote.countDocuments(query);

    res.status(200).json(
        ApiResponse.success('Cotizaciones obtenidas', {
            quotes,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        }).toJSON()
    );
});

// @desc    Obtener una cotización de cliente por ID
// @route   GET /api/admin/quotes/:id
const getQuoteById = asyncHandler(async (req, res) => {
    const quote = await Quote.findById(req.params.id)
        .populate({
            path: 'request',
            select: 'title serviceType client',
            populate: {
                path: 'client',
                select: 'name email'
            }
        })
        .populate('createdBy', 'name email');

    if (!quote) {
        return res.status(404).json(ApiResponse.notFound('Cotización no encontrada').toJSON());
    }

    res.status(200).json(
        ApiResponse.success('Cotización obtenida', { quote }).toJSON()
    );
});

// @desc    Crear cotización para diseñador a partir de una cotización de cliente aceptada
// @route   POST /api/admin/projects/:projectId/designer-quote
const createDesignerQuote = asyncHandler(async (req, res) => {
    const { quoteId } = req.params; // Ahora recibimos quoteId
    const { designerId, amount, description, deadline, adminNotes } = req.body;

    // 1. Buscar la cotización del cliente
    const clientQuote = await Quote.findById(quoteId).populate('request');
    if (!clientQuote) {
        return res.status(404).json(ApiResponse.notFound('Cotización de cliente no encontrada').toJSON());
    }

    // 2. Verificar que esté aceptada
    if (clientQuote.status !== 'accepted') {
        return res.status(400).json(ApiResponse.error('La cotización del cliente debe estar aceptada para asignar un diseñador', 400).toJSON());
    }

    // 3. Verificar diseñador
    const designer = await User.findOne({ _id: designerId, role: 'designer', isActive: true });
    if (!designer) {
        return res.status(400).json(ApiResponse.error('Diseñador no válido o inactivo', 400).toJSON());
    }

    // 4. Crear la DesignerQuote
    const designerQuote = await DesignerQuote.create({
        clientQuote: clientQuote._id,
        designer: designerId,
        amount,
        // Usamos el título de la solicitud asociada
        description: description || `Trabajo para: ${clientQuote.request.title}`,
        deadline,
        adminNotes,
        status: 'pending'
    });

    res.status(201).json(
        ApiResponse.success('Cotización enviada al diseñador', { designerQuote }, 201).toJSON()
    );
});

// @desc    Obtener todas las cotizaciones de diseñadores
// @route   GET /api/admin/designer-quotes
// @access  Private/Admin
const getAllDesignerQuotes = asyncHandler(async (req, res) => {
    // 1. Extraer search de req.query (faltaba en tu código)
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) query.status = status;

    // 2. Lógica de búsqueda replicada
    if (search) {
        // Buscamos solicitudes (Request) que coincidan con el título
        const matchingRequests = await mongoose.model('Request').find({
            title: { $regex: search, $options: 'i' }
        }).select('_id');

        const requestIds = matchingRequests.map(r => r._id);

        const matchingClientQuotes = await mongoose.model('Quote').find({
            request: { $in: requestIds }
        }).select('_id');

        const clientQuoteIds = matchingClientQuotes.map(cq => cq._id);

        // Filtramos las DesignerQuotes que pertenezcan a esas ClientQuotes
        query.clientQuote = { $in: clientQuoteIds };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const quotes = await DesignerQuote.find(query)
        .populate({
            path: 'clientQuote',
            populate: { path: 'request', select: 'title status' }
        })
        .populate('designer', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const total = await DesignerQuote.countDocuments(query);

    res.status(200).json(
        ApiResponse.success('Cotizaciones de diseñadores obtenidas', {
            quotes,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        }).toJSON()
    );
});

// @desc    Obtener una cotización de diseñador por ID
// @route   GET /api/admin/designer-quotes/:id
const getDesignerQuoteById = asyncHandler(async (req, res) => {
    const quote = await DesignerQuote.findOne({
        _id: req.params.id,
    }).populate({
        path: 'clientQuote',
        populate: {
            path: 'request',
            select: 'title description client serviceType',
            populate: { path: 'client', select: 'name email' }
        }
    });

    if (!quote) {
        return res.status(404).json(ApiResponse.notFound('Cotización no encontrada').toJSON());
    }

    res.status(200).json(
        ApiResponse.success('Cotización obtenida', { quote }).toJSON()
    );
});

// @desc    Obtener todas las solicitudes (admin)
// @route   GET /api/admin/requests
// @access  Private/Admin
const getAllRequests = asyncHandler(async (req, res) => {
    const { status, serviceType, search, page = 1, limit = 20 } = req.query;
    let query = {};

    // Filtros exactos
    if (status) query.status = status;
    if (serviceType) query.serviceType = serviceType;

    // Lógica de búsqueda (Search)
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { 'client.name': { $regex: search, $options: 'i' } } // Nota: Esto requiere un aggregate si el populate no es suficiente, pero por ahora busquemos en el título.
        ];
    }

    const skip = (page - 1) * limit;

    const requests = await Request.find(query)
        .populate('client', 'name email company phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

    const total = await Request.countDocuments(query);

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

// @desc    Obtener una solicitud por ID (admin)
// @route   GET /api/admin/requests/:id
// @access  Private/Admin
const getRequestById = asyncHandler(async (req, res) => {
    const request = await Request.findById(req.params.id)
        .populate('client', 'name email company phone');

    if (!request) {
        return res.status(404).json(
            ApiResponse.notFound('Solicitud no encontrada').toJSON()
        );
    }

    res.status(200).json(
        ApiResponse.success('Solicitud obtenida', {
            request
        }).toJSON()
    );
});

// @desc    Actualizar estado de una solicitud (admin)
// @route   PUT /api/admin/requests/:id/status
// @access  Private/Admin
const updateRequestStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    if (!status || !['requested', 'quoted', 'cancelled'].includes(status)) {
        return res.status(400).json(
            ApiResponse.error('Estado inválido', 400).toJSON()
        );
    }

    const request = await Request.findByIdAndUpdate(
        req.params.id,
        { status, updatedAt: Date.now() },
        { new: true, runValidators: true }
    ).populate('client', 'name email');

    if (!request) {
        return res.status(404).json(
            ApiResponse.notFound('Solicitud no encontrada').toJSON()
        );
    }

    res.status(200).json(
        ApiResponse.success('Estado de solicitud actualizado', {
            request
        }).toJSON()
    );
});

// @desc    Eliminar una solicitud (admin)
// @route   DELETE /api/admin/requests/:id
// @access  Private/Admin
const deleteRequest = asyncHandler(async (req, res) => {
    const request = await Request.findById(req.params.id);
    if (!request) {
        return res.status(404).json(
            ApiResponse.notFound('Solicitud no encontrada').toJSON()
        );
    }

    await request.deleteOne();
    res.status(200).json(
        ApiResponse.success('Solicitud eliminada').toJSON()
    );
});


module.exports = {
    getAllUsers,
    getUserStats,
    updateUser,
    deleteUser,
    getAllProjects,
    getUserById,
    getDesignerPortfolio,
    assignDesignerToProject,
    updateProjectStatus,
    getReports,
    createQuote,
    getAllQuotes,
    getQuoteById,
    createDesignerQuote,
    getAllDesignerQuotes,
    getDesignerQuoteById,
    getAllRequests,
    getRequestById,
    updateRequestStatus,
    deleteRequest
};
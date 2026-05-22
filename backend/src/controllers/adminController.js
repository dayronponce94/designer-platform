const User = require('../models/User');
const Project = require('../models/Project');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const mongoose = require('mongoose');
const Portfolio = require('../models/Portfolio');
const Quote = require('../models/Quote');
const DesignerQuote = require('../models/DesignerQuote');
const Request = require('../models/Request');
const NotificationHelper = require('../utils/notifications');


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

    // Si el admin envió isVerified: true en esta petición
    if (isVerified === true) {
        try {
            await NotificationHelper.createSystemNotification(
                updatedUser._id,
                'Cuenta Verificada',
                'Tu información ha sido verificada por los administradores. ¡Ya puedes empezar a crear proyectos en la plataforma!'
            );
        } catch (error) {
            // Usamos logger si lo tienes importado, o console.error para no romper la ejecución
            console.error(`Error enviando notificación: ${error.message}`);
        }
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


// @desc    Obtener reportes y estadísticas detalladas para el Dashboard
// @route   GET /api/admin/reports
// @access  Private/Admin
const getReports = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;

    // Configuración de filtro de fecha
    let dateFilter = {};
    if (startDate && endDate) {
        dateFilter = {
            createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        };
    } else {
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
        dateFilter = { createdAt: { $gte: twelveMonthsAgo } };
    }

    // 1. Métricas de Ingresos (Revenue), Ganancias (Profit) y Proyectos por Mes
    const financialStatsByMonth = await Project.aggregate([
        { $match: dateFilter },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' }
                },
                count: { $sum: 1 },
                revenue: { $sum: '$clientView.budget' },
                designerPayout: { $sum: '$designerView.earnings' }
            }
        },
        {
            $project: {
                _id: 0,
                year: '$_id.year',
                month: '$_id.month',
                count: 1,
                revenue: 1,
                profit: { $subtract: ['$revenue', '$designerPayout'] }
            }
        },
        { $sort: { year: 1, month: 1 } }
    ]);

    // 2. Distribución de Categorías (Service Type)
    const categoriesDistribution = await Project.aggregate([
        { $match: dateFilter },
        {
            $group: {
                _id: '$serviceType',
                count: { $sum: 1 },
                revenue: { $sum: '$clientView.budget' }
            }
        },
        { $project: { _id: 0, category: '$_id', count: 1, revenue: 1 } },
        { $sort: { count: -1 } }
    ]);

    // 3. Top 5 Diseñadores (por Ganancias Netas)
    const topDesigners = await Project.aggregate([
        { $match: { ...dateFilter, status: 'completed' } },
        {
            $group: {
                _id: '$designer',
                totalEarnings: { $sum: '$designerView.earnings' },
                projectsCount: { $sum: 1 }
            }
        },
        { $sort: { totalEarnings: -1 } },
        { $limit: 5 },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'userInfo'
            }
        },
        { $unwind: '$userInfo' },
        {
            $project: {
                _id: 1,
                name: '$userInfo.name',
                email: '$userInfo.email',
                totalEarnings: 1,
                projectsCount: 1
            }
        }
    ]);

    // 4. Top 5 Clientes (por Inversión Total)
    const topClients = await Project.aggregate([
        { $match: dateFilter },
        {
            $group: {
                _id: '$client',
                totalSpent: { $sum: '$clientView.budget' },
                projectsCount: { $sum: 1 }
            }
        },
        { $sort: { totalSpent: -1 } },
        { $limit: 5 },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'userInfo'
            }
        },
        { $unwind: '$userInfo' },
        {
            $project: {
                _id: 1,
                name: '$userInfo.name',
                email: '$userInfo.email',
                totalSpent: 1,
                projectsCount: 1
            }
        }
    ]);

    // 5. Estadísticas Generales (Overview Cards)
    const totalRevenueResult = await Project.aggregate([
        { $match: { ...dateFilter, status: { $ne: 'cancelled' } } },
        {
            $group: {
                _id: null,
                totalRev: { $sum: '$clientView.budget' },
                totalExp: { $sum: '$designerView.earnings' }
            }
        }
    ]);

    const totalClients = await User.countDocuments({ role: 'client' });
    const totalDesigners = await User.countDocuments({ role: 'designer' });
    const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });
    const totalProjects = await Project.countDocuments(dateFilter);
    const unassignedProjects = await Project.countDocuments({
        designer: { $exists: false },
        status: 'approved'
    });

    // 6. Proyectos por Estado (Para el gráfico circular que ya te funciona)
    const projectsByStatus = await Project.aggregate([
        { $match: dateFilter },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ]);

    res.status(200).json(
        ApiResponse.success('Reportes generados con éxito', {
            overview: {
                totalRevenue: totalRevenueResult[0]?.totalRev || 0,
                totalProfit: (totalRevenueResult[0]?.totalRev || 0) - (totalRevenueResult[0]?.totalExp || 0),
                totalProjects,
                totalUsers,
                totalClients,
                totalDesigners,
                unassignedProjects
            },
            financialStatsByMonth,
            categoriesDistribution,
            topDesigners,
            topClients,
            projectsByStatus: projectsByStatus.map(s => ({ status: s._id, count: s.count }))
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
    // Capturamos todos los filtros posibles
    const { page = 1, limit = 3, category, search } = req.query;

    const designer = await User.findOne({ _id: designerId, role: 'designer' }).select('-password');
    if (!designer) {
        return res.status(404).json(ApiResponse.notFound('Diseñador no encontrado').toJSON());
    }

    const Portfolio = require('../models/Portfolio');

    let query = { designerId: designerId };

    if (category && category !== 'all') {
        query.category = category;
    }

    if (search && search.trim() !== '') {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { tags: { $regex: search, $options: 'i' } }
        ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Ejecutar búsqueda con filtros
    const portfolioItems = await Portfolio.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    // 💡 CONTAR SOLO LOS DOCUMENTOS QUE CUMPLEN EL FILTRO
    const total = await Portfolio.countDocuments(query);

    res.status(200).json(
        ApiResponse.success('Portafolio obtenido', {
            designer,
            portfolio: portfolioItems,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total, // Este ahora será 6 si el filtro es "Diseño Web", por ejemplo
                pages: Math.ceil(total / parseInt(limit))
            }
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

    // Notificar al cliente sobre la nueva cotización
    try {
        await NotificationHelper.createSystemNotification(
            request.client, // El ID del cliente que viene de la solicitud
            'Nueva Cotización Disponible',
            `La solicitud "${request.title}" que realizó ha sido cotizada. Revise los detalles para proceder.`,
            { quoteId: quote._id, requestId: request._id } // Pasamos IDs extras por si el front los necesita
        );
    } catch (error) {
        logger.error(`Error enviando notificación al cliente: ${error.message}`);
    }

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
        .populate('assignedDesigner', 'name email')
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
                select: 'name email company phone'
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
    const { quoteId } = req.params;
    const { designerId, amount, description, deadline, adminNotes } = req.body;

    // 1. Buscar la cotización del cliente
    const clientQuote = await Quote.findById(quoteId).populate('request');
    if (!clientQuote) {
        return res.status(404).json(ApiResponse.notFound('Cotización de cliente no encontrada').toJSON());
    }

    // 2. Verificar que esté pagada
    if (clientQuote.status !== 'paid') {
        return res.status(400).json(ApiResponse.error('La cotización del cliente debe estar pagada para asignar un diseñador', 400).toJSON());
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
        description: description || `Trabajo para: ${clientQuote.request.title}`,
        deadline,
        adminNotes,
        status: 'pending'
    });

    // 💡 AQUÍ ES DONDE ACTUALIZAMOS LA COTIZACIÓN DEL CLIENTE
    // Guardamos quién es el diseñador asignado para que el frontend sepa qué botón mostrar
    await Quote.findByIdAndUpdate(quoteId, {
        assignedDesigner: designerId
        // Como dijiste, no tocamos el status, se queda en 'accepted'
    });

    // --- NUEVO: NOTIFICACIÓN 2 (Para el Diseñador asignado) ---
    try {
        const projectTitle = clientQuote.request?.title || 'un nuevo proyecto';
        const titleNotification = 'Nueva Oferta Asignada';
        const messageNotification = `Se te ha asignado una propuesta de diseño para el proyecto: "${projectTitle}". Revisa los detalles para aceptar o declinar el trabajo.`;

        await NotificationHelper.createSystemNotification(
            designerId,              // ID del diseñador (destinatario)
            titleNotification,
            messageNotification,
            {
                designerQuoteId: designerQuote._id,
                quoteId: clientQuote._id
            }
        );
        console.log(`🔔 Notificación de asignación enviada con éxito al diseñador: ${designerId}`);
    } catch (notifError) {
        console.error(`❌ Error al enviar notificación al diseñador: ${notifError.message}`);
    }

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
    })
        .populate({
            path: 'clientQuote',
            populate: {
                path: 'request',
                select: 'title description client serviceType',
                populate: {
                    path: 'client',
                    select: 'name email'
                }
            }
        })
        .populate({
            path: 'designer',
            select: 'name email specialty experience portfolio bio skills'
        });

    if (!quote) {
        return res.status(404).json(ApiResponse.notFound('Cotización no encontrada').toJSON());
    }
    console.log('POPULATED DESIGNER:', quote.designer);
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

    // --- NOTIFICACIÓN: Solicitud Cancelada ---
    // Solo disparamos si el nuevo estado es 'cancelled'
    if (status === 'cancelled') {
        try {
            await NotificationHelper.createSystemNotification(
                request.client._id, // ID del cliente que hizo la solicitud
                'Solicitud Cancelada',
                `La solicitud "${request.title}" ha sido cancelada por los administradores.`,
                { requestId: request._id } // Pasamos el ID por si el cliente quiere ver los detalles
            );
        } catch (error) {
            console.error(`Error enviando notificación de cancelación: ${error.message}`);
        }
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
const PortfolioItem = require('../models/Portfolio');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');

// @desc    Obtener items del portafolio
// @route   GET /api/portfolio
// @access  Público (pero con filtro por diseñador)
exports.getPortfolioItems = asyncHandler(async (req, res, next) => {
    const { designerId, category, featured, limit = 12, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Construir query
    const query = { isVisible: true };

    if (designerId) {
        query.designerId = designerId;
    }

    if (category) {
        query.category = category;
    }

    if (featured === 'true') {
        query.isFeatured = true;
    }

    // Obtener items
    const items = await PortfolioItem.find(query)
        .populate('designerId', 'name specialty experience')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    // Contar total
    const total = await PortfolioItem.countDocuments(query);

    res.json(new ApiResponse(
        'Portafolio obtenido exitosamente',
        {
            items,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        }
    ));
});

// @desc    Obtener items del portafolio del diseñador autenticado
// @route   GET /api/portfolio/my-portfolio
// @access  Privado (solo diseñador)
exports.getMyPortfolio = asyncHandler(async (req, res, next) => {
    const { category, limit = 20, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Construir query
    const query = { designerId: req.user.id };

    if (category) {
        query.category = category;
    }

    // Obtener items
    const items = await PortfolioItem.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    // Contar total
    const total = await PortfolioItem.countDocuments(query);

    res.json(new ApiResponse(
        'Portafolio personal obtenido exitosamente',
        {
            items,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        }
    ));
});

// @desc    Obtener item específico del portafolio
// @route   GET /api/portfolio/:id
// @access  Público
exports.getPortfolioItem = asyncHandler(async (req, res, next) => {
    const item = await PortfolioItem.findById(req.params.id)
        .populate('designerId', 'name specialty experience bio skills');

    if (!item) {
        return res.status(404).json({
            success: false,
            message: 'Item del portafolio no encontrado'
        });
    }

    res.json(new ApiResponse('Item del portafolio obtenido exitosamente', item));
});

// @desc    Crear nuevo item en el portafolio
// @route   POST /api/portfolio
// @access  Privado (solo diseñador)
exports.createPortfolioItem = asyncHandler(async (req, res, next) => {
    const { title, description, category, tags, images, clientName, projectDate, tools } = req.body;

    // Verificar que el usuario sea diseñador
    if (req.user.role !== 'designer') {
        return res.status(403).json({
            success: false,
            message: 'Solo los diseñadores pueden agregar items al portafolio'
        });
    }

    const portfolioItem = await PortfolioItem.create({
        designerId: req.user.id,
        title,
        description,
        category,
        tags: tags || [],
        images: images || [],
        clientName: clientName || '',
        projectDate: projectDate || null,
        tools: tools || []
    });

    res.status(201).json(new ApiResponse('Item agregado al portafolio exitosamente', portfolioItem));
});

// @desc    Actualizar item del portafolio
// @route   PUT /api/portfolio/:id
// @access  Privado (solo dueño del item)
exports.updatePortfolioItem = asyncHandler(async (req, res, next) => {
    let portfolioItem = await PortfolioItem.findById(req.params.id);

    if (!portfolioItem) {
        return res.status(404).json({
            success: false,
            message: 'Item del portafolio no encontrado'
        });
    }

    // Verificar que el usuario sea el dueño
    if (portfolioItem.designerId.toString() !== req.user.id) {
        return res.status(403).json({
            success: false,
            message: 'No tienes permiso para actualizar este item'
        });
    }

    // Extraer imágenes del body para no sobrescribirlas incorrectamente
    const { images, ...updateData } = req.body;

    // Actualizar campos
    Object.assign(portfolioItem, updateData);

    // Actualizar imágenes si se proporcionan
    if (images) {
        portfolioItem.images = images;
    }

    await portfolioItem.save();

    res.json(new ApiResponse('Item del portafolio actualizado exitosamente', portfolioItem));
});

// @desc    Eliminar item del portafolio
// @route   DELETE /api/portfolio/:id
// @access  Privado (solo dueño del item)
exports.deletePortfolioItem = asyncHandler(async (req, res, next) => {
    const portfolioItem = await PortfolioItem.findById(req.params.id);

    if (!portfolioItem) {
        return res.status(404).json({
            success: false,
            message: 'Item del portafolio no encontrado'
        });
    }

    // Verificar que el usuario sea el dueño
    if (portfolioItem.designerId.toString() !== req.user.id) {
        return res.status(403).json({
            success: false,
            message: 'No tienes permiso para eliminar este item'
        });
    }

    await portfolioItem.deleteOne();

    res.json(new ApiResponse('Item del portafolio eliminado exitosamente', null));
});

// @desc    Subir imágenes para el portafolio
// @route   POST /api/portfolio/upload-images
// @access  Privado (solo diseñador)
exports.uploadPortfolioImages = asyncHandler(async (req, res, next) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Por favor sube al menos una imagen'
        });
    }

    // Procesar las imágenes subidas
    const images = req.files.map(file => ({
        url: `${process.env.SERVER_URL}/uploads/portfolio/${file.filename}`,
        filename: file.originalname,
        isThumbnail: false,
        uploadedAt: new Date()
    }));

    // Marcar la primera imagen como thumbnail por defecto
    if (images.length > 0) {
        images[0].isThumbnail = true;
    }

    res.json(new ApiResponse('Imágenes subidas exitosamente', { images }));
});
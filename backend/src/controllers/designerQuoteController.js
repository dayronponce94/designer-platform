const DesignerQuote = require('../models/DesignerQuote');
const Project = require('../models/Project');
const Quote = require('../models/Quote');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Obtener cotizaciones asignadas al diseñador autenticado
// @route   GET /api/designer/quotes
const getMyDesignerQuotes = asyncHandler(async (req, res) => {
    const quotes = await DesignerQuote.find({ designer: req.user.id })
        .populate({
            path: 'clientQuote',
            populate: { path: 'project', select: 'title client' }
        })
        .sort({ createdAt: -1 });

    res.status(200).json(
        ApiResponse.success('Cotizaciones obtenidas', { quotes }).toJSON()
    );
});

// @desc    Obtener detalle de una cotización de diseñador
// @route   GET /api/designer/quotes/:id
const getDesignerQuoteById = asyncHandler(async (req, res) => {
    const quote = await DesignerQuote.findOne({
        _id: req.params.id,
        designer: req.user.id
    }).populate({
        path: 'clientQuote',
        populate: { path: 'project', select: 'title description client' }
    });

    if (!quote) {
        return res.status(404).json(ApiResponse.notFound('Cotización no encontrada').toJSON());
    }

    res.status(200).json(
        ApiResponse.success('Cotización obtenida', { quote }).toJSON()
    );
});

// @desc    Aceptar cotización de diseñador (crea proyecto tipo 'task')
// @route   POST /api/designer/quotes/:id/accept
const acceptDesignerQuote = asyncHandler(async (req, res) => {
    const quote = await DesignerQuote.findOne({
        _id: req.params.id,
        designer: req.user.id
    });

    if (!quote) {
        return res.status(404).json(ApiResponse.notFound('Cotización no encontrada').toJSON());
    }

    if (quote.status !== 'pending') {
        return res.status(400).json(ApiResponse.error('Esta cotización ya no está pendiente', 400).toJSON());
    }

    // Obtener cotización de cliente asociada
    const clientQuote = await Quote.findById(quote.clientQuote).populate('project');
    if (!clientQuote) {
        return res.status(404).json(ApiResponse.notFound('Cotización de cliente asociada no encontrada').toJSON());
    }

    // Crear proyecto tipo 'task'
    const taskProject = await Project.create({
        title: `[Tarea] ${clientQuote.project.title}`,
        description: quote.description,
        client: clientQuote.project.client,
        designer: req.user.id,
        serviceType: clientQuote.project.serviceType,
        status: 'approved',
        budget: quote.amount,
        deadline: quote.deadline,
        type: 'task',
        designerQuote: quote._id
    });

    // Actualizar cotización
    quote.status = 'accepted';
    quote.acceptedAt = new Date();
    quote.designerNotes = req.body.designerNotes || '';
    quote.project = taskProject._id;
    await quote.save();

    res.status(200).json(
        ApiResponse.success('Cotización aceptada. Proyecto creado.', { quote, project: taskProject }).toJSON()
    );
});

// @desc    Rechazar cotización de diseñador
// @route   POST /api/designer/quotes/:id/reject
const rejectDesignerQuote = asyncHandler(async (req, res) => {
    const quote = await DesignerQuote.findOne({
        _id: req.params.id,
        designer: req.user.id
    });

    if (!quote) {
        return res.status(404).json(ApiResponse.notFound('Cotización no encontrada').toJSON());
    }

    if (quote.status !== 'pending') {
        return res.status(400).json(ApiResponse.error('Esta cotización ya no está pendiente', 400).toJSON());
    }

    quote.status = 'rejected';
    quote.rejectedAt = new Date();
    quote.designerNotes = req.body.designerNotes || '';
    await quote.save();

    res.status(200).json(
        ApiResponse.success('Cotización rechazada', { quote }).toJSON()
    );
});

module.exports = {
    getMyDesignerQuotes,
    getDesignerQuoteById,
    acceptDesignerQuote,
    rejectDesignerQuote
};
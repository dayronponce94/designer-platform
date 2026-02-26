const DesignerQuote = require('../models/DesignerQuote');
const Project = require('../models/Project');
const Quote = require('../models/Quote');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const Request = require('../models/Request');

// @desc    Aceptar cotización de diseñador (Crea el Proyecto Único)
// @route   POST /api/designer/quotes/:id/accept
const acceptDesignerQuote = asyncHandler(async (req, res) => {
    // 1. Buscar la cotización con el populate necesario desde el inicio
    const quote = await DesignerQuote.findOne({
        _id: req.params.id,
        designer: req.user.id
    }).populate({
        path: 'clientQuote',
        populate: { path: 'request' }
    });

    if (!quote) {
        return res.status(404).json(ApiResponse.notFound('Cotización no encontrada').toJSON());
    }

    if (quote.status !== 'pending') {
        return res.status(400).json(ApiResponse.error('Esta cotización ya no está pendiente', 400).toJSON());
    }

    const clientQuote = quote.clientQuote;
    if (!clientQuote || !clientQuote.request) {
        return res.status(404).json(ApiResponse.notFound('Solicitud original no encontrada').toJSON());
    }

    // 2. CREAR EL PROYECTO
    const project = await Project.create({
        title: clientQuote.request.title,
        description: clientQuote.request.description,
        client: clientQuote.request.client,
        designer: req.user.id,
        serviceType: clientQuote.request.serviceType,
        status: 'approved',
        budget: clientQuote.amount,
        deadline: quote.deadline,
        designerQuote: quote._id,
        attachments: clientQuote.request.attachments || []
    });

    // 3. ACTUALIZAR LA COTIZACIÓN DEL DISEÑADOR
    quote.status = 'accepted';
    quote.acceptedAt = new Date();
    quote.designerNotes = req.body.designerNotes || '';
    quote.project = project._id;
    await quote.save();

    // 4. FINALIZAR EL FLUJO DE LA SOLICITUD
    try {
        await Request.findByIdAndUpdate(clientQuote.request._id, {
            status: 'quoted'
        });
    } catch (error) {
        console.error('Error al actualizar la solicitud:', error);
    }

    res.status(200).json(
        ApiResponse.success('Cotización aceptada con éxito. El proyecto ha sido iniciado.', {
            quote,
            project
        }).toJSON()
    );
});

// Los métodos getMyDesignerQuotes y getDesignerQuoteById también necesitan 
// limpiar el populate de '.project' si antes esperaban la estructura vieja.

const getMyDesignerQuotes = asyncHandler(async (req, res) => {
    const quotes = await DesignerQuote.find({ designer: req.user.id })
        .populate({
            path: 'clientQuote',
            populate: { path: 'request', select: 'title client' }
        })
        .sort({ createdAt: -1 });

    res.status(200).json(
        ApiResponse.success('Cotizaciones obtenidas', { quotes }).toJSON()
    );
});

const getDesignerQuoteById = asyncHandler(async (req, res) => {
    const quote = await DesignerQuote.findOne({
        _id: req.params.id,
        designer: req.user.id
    }).populate({
        path: 'clientQuote',
        populate: { path: 'request', select: 'title description client' }
    });

    if (!quote) {
        return res.status(404).json(ApiResponse.notFound('Cotización no encontrada').toJSON());
    }

    res.status(200).json(
        ApiResponse.success('Cotización obtenida', { quote }).toJSON()
    );
});

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
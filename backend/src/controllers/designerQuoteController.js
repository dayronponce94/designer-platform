const DesignerQuote = require('../models/DesignerQuote');
const Project = require('../models/Project');
const Quote = require('../models/Quote');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Aceptar cotización de diseñador (Crea el Proyecto Único)
// @route   POST /api/designer/quotes/:id/accept
const acceptDesignerQuote = asyncHandler(async (req, res) => {
    // 1. Buscar la cotización del diseñador
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

    // 2. Obtener cotización de cliente y su Solicitud (Request) original
    // Poblamos 'request' porque de ahí sacaremos los datos iniciales
    const clientQuote = await Quote.findById(quote.clientQuote).populate('request');

    if (!clientQuote || !clientQuote.request) {
        return res.status(404).json(ApiResponse.notFound('La solicitud original no fue encontrada').toJSON());
    }

    // 3. CREAR EL PROYECTO ÚNICO
    // Aquí es donde unificamos la Solicitud del cliente con la Cotización del diseñador
    const project = await Project.create({
        title: clientQuote.request.title, // Nombre original que puso el cliente
        description: clientQuote.request.description, // Descripción original
        client: clientQuote.request.client,
        designer: req.user.id,
        serviceType: clientQuote.request.serviceType,
        status: 'approved', // El proyecto inicia aprobado tras la aceptación del diseñador
        budget: clientQuote.amount, // El presupuesto final (lo que paga el cliente)
        deadline: quote.deadline, // La fecha límite acordada con el diseñador
        designerQuote: quote._id,
        attachments: clientQuote.request.attachments || [] // Heredamos los archivos de la solicitud
    });

    // 4. Actualizar la cotización del diseñador
    quote.status = 'accepted';
    quote.acceptedAt = new Date();
    quote.designerNotes = req.body.designerNotes || '';
    quote.project = project._id; // Referencia al nuevo proyecto
    await quote.save();

    // 5. Opcional: Podrías actualizar el estado de la Request a "in-progress" 
    // si quieres trackear que la solicitud ya es un proyecto vivo.
    clientQuote.request.status = 'approved';
    await clientQuote.request.save();

    res.status(200).json(
        ApiResponse.success('Cotización aceptada. El proyecto ha sido creado oficialmente.', {
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
            populate: { path: 'request', select: 'title client' } // Cambiado de project a request
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
        populate: { path: 'request', select: 'title description client' } // Cambiado de project a request
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
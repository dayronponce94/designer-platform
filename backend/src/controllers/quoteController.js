const Quote = require('../models/Quote');
const Request = require('../models/Request');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const mongoose = require('mongoose');

// @desc    Obtener todas las cotizaciones del cliente autenticado
// @route   GET /api/quotes
// @access  Private (cliente)
const getMyQuotes = asyncHandler(async (req, res) => {
    // Verificar que el usuario sea cliente (opcional, pero podemos permitir también a admin ver todas)
    const userId = req.user.id;

    // Buscar proyectos del cliente
    const requests = await Request.find({ client: userId }).select('_id');
    const requestsIds = requests.map(p => p._id);

    const quotes = await Quote.find({ request: { $in: requestsIds } })
        .populate('request', 'title description serviceType status')
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 });

    res.status(200).json(
        ApiResponse.success('Cotizaciones obtenidas', { quotes }).toJSON()
    );
});

// @desc    Obtener detalle de una cotización por ID
// @route   GET /api/quotes/:id
// @access  Private (cliente dueño o admin)
const getQuoteById = asyncHandler(async (req, res) => {
    const quote = await Quote.findById(req.params.id)
        .populate('request', 'title description serviceType status client')
        .populate('createdBy', 'name email');

    if (!quote) {
        return res.status(404).json(ApiResponse.notFound('Cotización no encontrada').toJSON());
    }

    // Verificar que el usuario sea el cliente de la cotización o admin
    const request = await Request.findById(quote.request._id);
    if (
        req.user.role !== 'admin' &&
        request.client.toString() !== req.user.id
    ) {
        return res.status(403).json(ApiResponse.forbidden('No tienes acceso a esta cotización').toJSON());
    }

    res.status(200).json(
        ApiResponse.success('Cotización obtenida', { quote }).toJSON()
    );
});

// @desc    Aceptar una cotización
// @route   POST /api/quotes/:id/accept
// @access  Private (cliente dueño)
const acceptQuote = asyncHandler(async (req, res) => {
    const quote = await Quote.findById(req.params.id);
    if (!quote) {
        return res.status(404).json(ApiResponse.notFound('Cotización no encontrada').toJSON());
    }

    const request = await Request.findById(quote.request);
    if (!request) {
        return res.status(404).json(ApiResponse.notFound('Solicitud asociada no encontrada').toJSON());
    }

    // Verificar que el usuario sea el cliente de la cotización
    if (request.client.toString() !== req.user.id) {
        return res.status(403).json(ApiResponse.forbidden('No puedes aceptar esta cotización').toJSON());
    }

    if (quote.status !== 'pending') {
        return res.status(400).json(ApiResponse.error('Esta cotización ya no está pendiente', 400).toJSON());
    }

    // Actualizar cotización
    quote.status = 'accepted';
    quote.acceptedAt = new Date();
    quote.clientNotes = req.body.clientNotes || '';
    await quote.save();

    // Aquí podrías crear una notificación para el admin (opcional)

    res.status(200).json(
        ApiResponse.success('Cotización aceptada', { quote }).toJSON()
    );
});

// @desc    Rechazar una cotización
// @route   POST /api/quotes/:id/reject
// @access  Private (cliente dueño)
const rejectQuote = asyncHandler(async (req, res) => {
    const quote = await Quote.findById(req.params.id);
    if (!quote) {
        return res.status(404).json(ApiResponse.notFound('Cotización no encontrada').toJSON());
    }

    const request = await Request.findById(quote.request);
    if (!request) {
        return res.status(404).json(ApiResponse.notFound('Solicitud asociada no encontrada').toJSON());
    }

    if (request.client.toString() !== req.user.id) {
        return res.status(403).json(ApiResponse.forbidden('No puedes rechazar esta cotización').toJSON());
    }

    if (quote.status !== 'pending') {
        return res.status(400).json(ApiResponse.error('Esta cotización ya no está pendiente', 400).toJSON());
    }

    quote.status = 'rejected';
    quote.rejectedAt = new Date();
    quote.clientNotes = req.body.clientNotes || '';
    await quote.save();

    // No cambiamos el estado de la solicitud, se queda en 'quoted' para permitir nuevas cotizaciones

    res.status(200).json(
        ApiResponse.success('Cotización rechazada', { quote }).toJSON()
    );
});

module.exports = {
    getMyQuotes,
    getQuoteById,
    acceptQuote,
    rejectQuote,
};
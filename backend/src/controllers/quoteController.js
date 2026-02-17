const Quote = require('../models/Quote');
const Project = require('../models/Project');
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
    const projects = await Project.find({ client: userId }).select('_id');
    const projectIds = projects.map(p => p._id);

    const quotes = await Quote.find({ project: { $in: projectIds } })
        .populate('project', 'title description serviceType status')
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
        .populate('project', 'title description serviceType status client')
        .populate('createdBy', 'name email');

    if (!quote) {
        return res.status(404).json(ApiResponse.notFound('Cotización no encontrada').toJSON());
    }

    // Verificar que el usuario sea el cliente del proyecto o admin
    const project = await Project.findById(quote.project._id);
    if (
        req.user.role !== 'admin' &&
        project.client.toString() !== req.user.id
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

    const project = await Project.findById(quote.project);
    if (!project) {
        return res.status(404).json(ApiResponse.notFound('Proyecto asociado no encontrado').toJSON());
    }

    // Verificar que el usuario sea el cliente del proyecto
    if (project.client.toString() !== req.user.id) {
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

    // Actualizar proyecto a 'approved' si corresponde
    project.status = 'approved';
    // Opcional: guardar referencia a la cotización aceptada (podríamos agregar un campo acceptedQuote en Project)
    await project.save();

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

    const project = await Project.findById(quote.project);
    if (!project) {
        return res.status(404).json(ApiResponse.notFound('Proyecto asociado no encontrado').toJSON());
    }

    if (project.client.toString() !== req.user.id) {
        return res.status(403).json(ApiResponse.forbidden('No puedes rechazar esta cotización').toJSON());
    }

    if (quote.status !== 'pending') {
        return res.status(400).json(ApiResponse.error('Esta cotización ya no está pendiente', 400).toJSON());
    }

    quote.status = 'rejected';
    quote.rejectedAt = new Date();
    quote.clientNotes = req.body.clientNotes || '';
    await quote.save();

    // No cambiamos el estado del proyecto, se queda en 'quoted' para permitir nuevas cotizaciones

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
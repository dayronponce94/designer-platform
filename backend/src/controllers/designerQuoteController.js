const DesignerQuote = require('../models/DesignerQuote');
const Project = require('../models/Project');
const Quote = require('../models/Quote');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const Request = require('../models/Request');
const mongoose = require('mongoose');

// @desc    Aceptar cotización de diseñador (Crea el Proyecto Único con Snapshots)
// @route   POST /api/designer/quotes/:id/accept
const acceptDesignerQuote = asyncHandler(async (req, res) => {
    // 1. Buscar la cotización con el populate profundo
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
    const requestOriginal = clientQuote?.request;

    if (!clientQuote || !requestOriginal) {
        return res.status(404).json(ApiResponse.notFound('Datos de la solicitud o cotización de cliente no encontrados').toJSON());
    }

    // 2. CREAR EL PROYECTO (Mapeo al nuevo esquema de Snapshots)
    const project = await Project.create({
        title: requestOriginal.title,
        serviceType: requestOriginal.serviceType,
        status: 'approved',
        client: requestOriginal.client,
        designer: req.user.id,
        designerQuote: quote._id,
        references: requestOriginal.references || '',

        // --- Snapshot para el Cliente ---
        clientView: {
            description: requestOriginal.description,
            budget: clientQuote.amount, // Lo que paga el cliente (PVP)
            deadline: clientQuote.deadline || quote.deadline, // Fecha de entrega final
            attachments: requestOriginal.attachments || [] // Archivos heredados de la request
        },

        // --- Snapshot para el Diseñador ---
        designerView: {
            description: quote.description || 'Sin notas adicionales', // Notas de la cotización del diseñador
            earnings: quote.amount, // Lo que el diseñador cobra realmente
            internalDeadline: quote.deadline, // Su fecha límite (con colchón)
            isPaidToDesigner: false, // Inicialmente falso, se actualizará cuando se pague al diseñador
            paidAt: null, // Fecha en que se realizó el pago al diseñador
            attachments: quote.attachments || [] // Si el diseñador adjuntó algo en su quote
        },

        // Inicializar vacío para el futuro
        deliverables: [],
        messages: []
    });

    // 3. ACTUALIZAR LA COTIZACIÓN DEL DISEÑADOR
    quote.status = 'accepted';
    quote.acceptedAt = new Date();
    quote.designerNotes = req.body.designerNotes || '';
    quote.project = project._id;
    await quote.save();

    // 4. ACTUALIZAR ESTADO DE LA SOLICITUD ORIGINAL (Corregido)
    try {
        await Request.findByIdAndUpdate(requestOriginal._id, {
            // 'quoted' es el estado terminal lógico para una solicitud procesada
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

// @desc    Obtener todas las cotizaciones del diseñador autenticado (con filtros y paginación)
// @route   GET /api/designer/quotes
// @access  Private (Designer)
const getMyDesignerQuotes = asyncHandler(async (req, res) => {
    const { status, search, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // 1. Iniciamos el Pipeline sobre la colección DesignerQuote
    let pipeline = [
        // Filtramos por el ID del diseñador autenticado
        { $match: { designer: new mongoose.Types.ObjectId(req.user.id) } }
    ];

    // 2. Filtro por Estado
    if (status && status !== '') {
        pipeline.push({ $match: { status: status } });
    }

    // 3. UNIÓN CON 'quotes' (La cotización del cliente que originó esto)
    // En el modelo DesignerQuote, el campo se llama 'clientQuote'
    pipeline.push({
        $lookup: {
            from: 'quotes', // Nombre real de la colección según tu lista
            localField: 'clientQuote',
            foreignField: '_id',
            as: 'clientQuote'
        }
    }, { $unwind: '$clientQuote' });

    // 4. UNIÓN CON 'requests' (Para obtener el título del proyecto)
    pipeline.push({
        $lookup: {
            from: 'requests', // Nombre real de la colección
            localField: 'clientQuote.request',
            foreignField: '_id',
            as: 'clientQuote.request'
        }
    }, { $unwind: '$clientQuote.request' });

    // 5. UNIÓN CON 'users' (Opcional: Para traer datos del cliente si los necesitas)
    pipeline.push({
        $lookup: {
            from: 'users',
            localField: 'clientQuote.request.client',
            foreignField: '_id',
            as: 'clientQuote.request.client'
        }
    }, { $unwind: { path: '$clientQuote.request.client', preserveNullAndEmptyArrays: true } });

    // 6. FILTRO DE BÚSQUEDA
    if (search && search.trim() !== '') {
        const searchRegex = new RegExp(search, 'i');
        pipeline.push({
            $match: {
                $or: [
                    { 'clientQuote.request.title': searchRegex },
                    { 'description': searchRegex } // Descripción de la cotización del diseñador
                ]
            }
        });
    }

    // 7. Conteo para paginación
    const countPipeline = [...pipeline, { $count: "total" }];
    const countResult = await DesignerQuote.aggregate(countPipeline);
    const total = countResult.length > 0 ? countResult[0].total : 0;

    // 8. Orden y Paginación
    pipeline.push(
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: Number(limit) }
    );

    const quotes = await DesignerQuote.aggregate(pipeline);

    res.status(200).json(
        ApiResponse.success('Cotizaciones obtenidas', {
            quotes,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit))
            }
        }).toJSON()
    );
});

// @desc    Obtener detalle de una cotización específica del diseñador
// @route   GET /api/designer/quotes/:id
// @access  Private (Designer)
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

    res.status(200).json(
        ApiResponse.success('Cotización obtenida', { quote }).toJSON()
    );
});

// @desc    Rechazar una cotización de diseñador (Cambia estado a 'rejected')
// @route   POST /api/designer/quotes/:id/reject
// @access  Private (Designer)
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
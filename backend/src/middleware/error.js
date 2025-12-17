const ApiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    logger.error('Error Handler:', err.message);
    logger.debug('Stack:', err.stack);

    let statusCode = err.statusCode || 500;
    let message = err.message || 'Error interno del servidor';

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(el => el.message);
        message = `Datos inválidos: ${errors.join(', ')}`;
        statusCode = 400;
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        message = 'Ya existe un registro con este valor';
        statusCode = 400;
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        message = 'Token inválido';
        statusCode = 401;
    }

    if (err.name === 'TokenExpiredError') {
        message = 'Token expirado';
        statusCode = 401;
    }

    const response = ApiResponse.error(message, statusCode);

    res.status(statusCode).json(response.toJSON());
};

module.exports = errorHandler;
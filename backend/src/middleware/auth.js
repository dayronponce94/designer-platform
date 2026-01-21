const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');
const env = require('../config/env');

// Middleware para proteger rutas (requiere login)
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Verificar token
            const decoded = jwt.verify(token, env.JWT_SECRET);

            // Obtener usuario del token
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json(
                    ApiResponse.unauthorized('Usuario no encontrado').toJSON()
                );
            }

            // Verificar si el usuario está activo
            if (!req.user.isActive) {
                return res.status(401).json(
                    ApiResponse.unauthorized('Cuenta desactivada').toJSON()
                );
            }

            next();
        } catch (error) {
            console.error('Error en autenticación:', error);
            return res.status(401).json(
                ApiResponse.unauthorized('Token no válido').toJSON()
            );
        }
    }

    if (!token) {
        return res.status(401).json(
            ApiResponse.unauthorized('No autorizado, token no proporcionado').toJSON()
        );
    }
};

// Middleware genérico para roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json(
                ApiResponse.forbidden(`El rol ${req.user?.role} no tiene acceso a este recurso`).toJSON()
            );
        }
        next();
    };
};

module.exports = { protect, authorize };
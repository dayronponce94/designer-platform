const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Get token from header or cookie
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json(ApiResponse.unauthorized().toJSON());
    }

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json(ApiResponse.unauthorized('Token inválido').toJSON());
    }
});

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json(
                ApiResponse.forbidden(`El rol ${req.user.role} no tiene acceso a este recurso`).toJSON()
            );
        }
        next();
    };
};

module.exports = { protect, authorize };
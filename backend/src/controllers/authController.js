const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../utils/logger');

// @desc    Registrar usuario
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
    const { name, email, password, role, company, phone } = req.body;


    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json(
            ApiResponse.error('El usuario ya está registrado', 400).toJSON()
        );
    }

    // Crear usuario
    const user = await User.create({
        name,
        email,
        password,
        role: role || 'client',
        company,
        phone
    });

    // Generar token
    const token = user.getSignedJwtToken();

    // Configurar cookie
    res.cookie('token', token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });

    logger.info(`Nuevo usuario registrado: ${email}`);

    res.status(201).json(
        ApiResponse.success('Usuario registrado exitosamente', {
            user: user.toPublicJSON(),
            token
        }, 201).toJSON()
    );
});

// @desc    Iniciar sesión
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validar email y password
    if (!email || !password) {
        return res.status(400).json(
            ApiResponse.error('Por favor ingrese email y contraseña', 400).toJSON()
        );
    }

    // Buscar usuario
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return res.status(401).json(
            ApiResponse.error('Credenciales inválidas', 401).toJSON()
        );
    }

    // Verificar password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return res.status(401).json(
            ApiResponse.error('Credenciales inválidas', 401).toJSON()
        );
    }

    // Actualizar último login
    user.lastLogin = new Date();
    await user.save();

    // Generar token
    const token = user.getSignedJwtToken();

    // Configurar cookie
    res.cookie('token', token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });

    logger.info(`Usuario inició sesión: ${email}`);

    res.status(200).json(
        ApiResponse.success('Inicio de sesión exitoso', {
            user: user.toPublicJSON(),
            token
        }).toJSON()
    );
});

// @desc    Cerrar sesión
// @route   GET /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json(
        ApiResponse.success('Sesión cerrada exitosamente').toJSON()
    );
});

// @desc    Obtener usuario actual
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    res.status(200).json(
        ApiResponse.success('Perfil obtenido', {
            user: user.toPublicJSON()
        }).toJSON()
    );
});

module.exports = {
    register,
    login,
    logout,
    getMe
};
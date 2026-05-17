const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../utils/logger');
const { sendEmail } = require('../utils/email');
const crypto = require('crypto');
const NotificationHelper = require('../utils/notifications');


// @desc    Registrar usuario
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
    const { name, email, password, role, company, phone, specialty } = req.body;


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
        phone,
        specialty
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

    // Notificar a los administradores sobre el nuevo registro
    logger.info(`Nuevo usuario registrado: ${email}`);

    // Usamos el helper que ya tienes implementado
    try {
        await NotificationHelper.notifyAdmins(
            User, // Pasamos el modelo User para que el helper busque los admins
            'Nuevo registro de usuario',
            `Un nuevo ${user.role === 'designer' ? 'diseñador' : 'cliente'} llamado ${user.name} se ha unido. Por favor, verifica su perfil.`
        );
    } catch (error) {
        logger.error(`Error enviando notificación de registro: ${error.message}`);
        // No bloqueamos el registro si falla la notificación
    }

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

    if (!user.isActive) {
        return res.status(403).json(
            ApiResponse.error('Su usuario está inactivo, por favor contacte con soporte técnico.', 403).toJSON()
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


// @desc    Enviar correo para recuperar contraseña
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
    console.log("1. Intento de forgotPassword para el email:", req.body.email); // LOG

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        console.log("2. Usuario no encontrado en la base de datos"); // LOG
        return res.status(404).json(
            ApiResponse.error('No hay un usuario registrado con ese email', 404).toJSON()
        );
    }

    const resetToken = user.getResetPasswordToken();
    console.log("3. Token generado:", resetToken); // LOG

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    console.log("4. URL de reset preparada:", resetUrl); // LOG

    try {
        console.log("5. Intentando enviar email con nodemailer..."); // LOG
        await sendEmail({
            email: user.email,
            subject: 'Recuperación de contraseña',
            resetUrl: resetUrl
        });

        console.log("6. ¡Email enviado exitosamente!"); // LOG
        res.status(200).json(ApiResponse.success('Correo enviado').toJSON());
    } catch (err) {
        console.error("7. ERROR CRÍTICO EN SENDEMAIL:", err); // LOG DETALLADO
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return res.status(500).json(ApiResponse.error('Error al enviar', 500).toJSON());
    }
});

// @desc    Restablecer contraseña
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
    // 1. Hashear el token que viene en la URL para compararlo con el de la BD
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }, // Verificar que no haya expirado
    });

    if (!user) {
        return res.status(400).json(
            ApiResponse.error('Token inválido o expirado', 400).toJSON()
        );
    }

    // 2. Establecer la nueva contraseña
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // 3. Generar nuevo JWT para que el usuario quede logueado de una vez
    const token = user.getSignedJwtToken();

    res.status(200).json(
        ApiResponse.success('Contraseña actualizada correctamente', { token }).toJSON()
    );
});



module.exports = {
    register,
    login,
    logout,
    getMe,
    forgotPassword,
    resetPassword
};
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Por favor ingrese su nombre'],
            trim: true,
            maxlength: [50, 'El nombre no puede exceder 50 caracteres']
        },

        email: {
            type: String,
            required: [true, 'Por favor ingrese su email'],
            unique: true,
            lowercase: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Por favor ingrese un email válido'
            ]
        },

        password: {
            type: String,
            required: [true, 'Por favor ingrese una contraseña'],
            minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
            select: false
        },

        role: {
            type: String,
            enum: ['client', 'designer', 'admin'],
            default: 'client'
        },

        isVerified: {
            type: Boolean,
            default: false
        },

        // Campos específicos para clientes
        company: {
            type: String,
            default: ''
        },

        phone: {
            type: String,
            default: ''
        },

        // Campos específicos para diseñadores
        specialty: {
            type: String,
            enum: ['branding', 'ux-ui', 'graphic', 'web', 'motion', 'illustration', 'other'],
            default: 'other'
        },

        experience: {
            type: Number,
            default: 0
        },

        portfolio: {
            type: String,
            default: ''
        },

        bio: {
            type: String,
            default: '',
            maxlength: [500, 'La biografía no puede exceder 500 caracteres']
        },

        skills: [{
            type: String
        }],

        isActive: {
            type: Boolean,
            default: true
        },

        lastLogin: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

// Encriptar contraseña antes de guardar
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Comparar contraseña ingresada con la almacenada
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generar JWT token
userSchema.methods.getSignedJwtToken = function () {
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
            role: this.role
        },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRE }
    );
};

// Método para obtener datos públicos del usuario
userSchema.methods.toPublicJSON = function () {
    const userObject = this.toObject();

    // Eliminar campos sensibles
    delete userObject.password;
    delete userObject.__v;

    return userObject;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
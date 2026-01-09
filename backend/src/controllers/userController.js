const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Obtener todos los usuarios (solo admin)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');

    res.status(200).json(
        ApiResponse.success('Usuarios obtenidos', {
            users,
            count: users.length
        }).toJSON()
    );
});

// @desc    Obtener usuario por ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
        return res.status(404).json(
            ApiResponse.notFound('Usuario no encontrado').toJSON()
        );
    }

    res.status(200).json(
        ApiResponse.success('Usuario obtenido', {
            user
        }).toJSON()
    );
});

// @desc    Actualizar usuario
// @route   PUT /api/users/:id
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
    const fieldsToUpdate = {
        name: req.body.name,
        company: req.body.company,
        phone: req.body.phone,
        bio: req.body.bio,
        specialty: req.body.specialty,
        experience: req.body.experience,
        skills: req.body.skills,
        portfolio: req.body.portfolio
    };

    // Solo administradores pueden cambiar el rol
    if (req.user.role === 'admin' && req.body.role) {
        fieldsToUpdate.role = req.body.role;
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        fieldsToUpdate,
        {
            new: true,
            runValidators: true
        }
    ).select('-password');

    if (!user) {
        return res.status(404).json(
            ApiResponse.notFound('Usuario no encontrado').toJSON()
        );
    }

    res.status(200).json(
        ApiResponse.success('Usuario actualizado', {
            user
        }).toJSON()
    );
});

// @desc    Eliminar usuario
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json(
            ApiResponse.notFound('Usuario no encontrado').toJSON()
        );
    }

    await user.deleteOne();

    res.status(200).json(
        ApiResponse.success('Usuario eliminado').toJSON()
    );
});

// @desc    Obtener diseñadores (para la diseñadora principal)
// @route   GET /api/users/designers
// @access  Private/Admin
const getDesigners = asyncHandler(async (req, res) => {
    const designers = await User.find({
        role: 'designer',
        isActive: true
    }).select('-password');

    res.status(200).json(
        ApiResponse.success('Diseñadores obtenidos', {
            designers,
            count: designers.length
        }).toJSON()
    );
});

module.exports = {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    getDesigners
};
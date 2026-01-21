const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');
const env = require('../src/config/env');

async function createAdminUser() {
    try {
        // Conectar a MongoDB
        await mongoose.connect(env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Conectado a MongoDB para inicialización de admin...');

        // Verificar si ya existe el administrador
        const existingAdmin = await User.findOne({
            email: 'verallero@gmail.com',
            role: 'admin'
        });

        if (existingAdmin) {
            console.log('✅ Administrador ya existe en la base de datos');
            console.log(`Nombre: ${existingAdmin.name}`);
            console.log(`Email: ${existingAdmin.email}`);
            console.log(`Rol: ${existingAdmin.role}`);
            process.exit(0);
        }

        // Crear el administrador con contraseña segura
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Admin123!', salt); // Contraseña temporal

        const adminUser = new User({
            name: 'Verónica Llerandi',
            email: 'verallero@gmail.com',
            password: 'Admin123!',
            role: 'admin',
            isVerified: true,
            isActive: true,
            // Info adicional para el perfil
            bio: 'Diseñadora principal y administradora del sistema',
            specialty: 'branding',
            experience: 8,
            skills: ['Diseño de marca', 'Diseño UX/UI ', 'Diseño Gráfico', 'Animación Gráfica']
        });

        await adminUser.save();

        console.log('🎉 Administrador creado exitosamente!');
        console.log('📋 Credenciales:');
        console.log('Email: verallero@gmail.com');
        console.log('Contraseña temporal: Admin123!');
        console.log('⚠️ IMPORTANTE: Cambia la contraseña después del primer login');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creando administrador:', error);
        process.exit(1);
    }
}

// Ejecutar el script
createAdminUser();
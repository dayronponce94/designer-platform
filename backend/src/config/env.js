require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const env = {
    // Server
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 5000,
    SERVER_URL: process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`,

    // Database
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/designer_platform',

    // JWT
    JWT_SECRET: process.env.JWT_SECRET || 'your_fallback_jwt_secret_development_only',
    JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
    JWT_COOKIE_EXPIRE: parseInt(process.env.JWT_COOKIE_EXPIRE || '7'),

    // Frontend
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

    // Stripe
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
};

// Validar variables críticas
if (!env.JWT_SECRET || env.JWT_SECRET === 'your_fallback_jwt_secret_development_only') {
    console.warn('⚠️  ADVERTENCIA: JWT_SECRET no configurado, usando valor por defecto (solo para desarrollo)');
}

if (!env.MONGODB_URI) {
    console.error('❌ ERROR: MONGODB_URI no está configurado');
    process.exit(1);
}

module.exports = env;
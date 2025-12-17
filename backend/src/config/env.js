require('dotenv').config();

const env = {
    // Server
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 5000,
    SERVER_URL: process.env.SERVER_URL || 'http://localhost:5000',

    // Database
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/designer_platform',

    // JWT
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
    JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
    JWT_COOKIE_EXPIRE: parseInt(process.env.JWT_COOKIE_EXPIRE) || 7,

    // Frontend
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

    // Stripe
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',

    // Email
    SMTP_HOST: process.env.SMTP_HOST || '',
    SMTP_PORT: process.env.SMTP_PORT || 587,
    SMTP_EMAIL: process.env.SMTP_EMAIL || '',
    SMTP_PASSWORD: process.env.SMTP_PASSWORD || '',
    FROM_EMAIL: process.env.FROM_EMAIL || 'noreply@designerplatform.com',
    FROM_NAME: process.env.FROM_NAME || 'Designer Platform',

    // Check required environment variables
    checkRequiredEnv: function () {
        const required = ['JWT_SECRET', 'MONGODB_URI'];
        const missing = [];

        required.forEach(key => {
            if (!this[key]) {
                missing.push(key);
            }
        });

        if (missing.length > 0) {
            console.error(`Missing required environment variables: ${missing.join(', ')}`);
            process.exit(1);
        }
    }
};

env.checkRequiredEnv();

module.exports = env;
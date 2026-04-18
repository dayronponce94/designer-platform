const Stripe = require('stripe');
const env = require('../config/env');

let stripe;
if (env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-02-24.acacia', // última versión estable
    });
    console.log('✅ Stripe inicializado');
} else {
    console.warn('⚠️ STRIPE_SECRET_KEY no configurado. Los pagos no funcionarán.');
}

module.exports = stripe;
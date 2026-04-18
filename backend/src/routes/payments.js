const express = require('express');
const router = express.Router();
const {
    createClientPaymentIntent,
    getUserPayments,
    getUserPaymentSummary,
    getPaymentMethods,
    payDesigner,
    getAllPayments,
    getPlatformTransactions,
    handleStripeWebhook, // <--- Asegúrate de importar esto
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

// --- RUTA DEL WEBHOOK (DEBE IR ANTES DE PROTECT) ---
// Usamos express.raw solo para esta ruta para que Stripe pueda validar la firma
router.post(
    '/webhook',
    express.raw({ type: 'application/json' }),
    handleStripeWebhook
);

router.use(express.json());

// Rutas protegidas para usuarios autenticados
router.use(protect);

router.post('/create-payment-intent/:quoteId', createClientPaymentIntent);
router.get('/my-payments', getUserPayments);
router.get('/my-summary', getUserPaymentSummary);
router.get('/my-methods', getPaymentMethods);

// Rutas solo para admin
router.get('/admin/all', authorize('admin'), getAllPayments);
router.get('/admin/platform-stats', authorize('admin'), getPlatformTransactions);
router.post('/admin/pay-designer/:designerQuoteId', authorize('admin'), payDesigner);

module.exports = router;
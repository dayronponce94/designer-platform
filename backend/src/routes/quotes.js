const express = require('express');
const router = express.Router();
const {
    getMyQuotes,
    getQuoteById,
    acceptQuote,
    rejectQuote,
} = require('../controllers/quoteController');
const { protect } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(protect);

router.route('/')
    .get(getMyQuotes);

router.route('/:id')
    .get(getQuoteById);

router.post('/:id/accept', acceptQuote);
router.post('/:id/reject', rejectQuote);

module.exports = router;
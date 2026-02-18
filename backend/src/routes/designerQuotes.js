const express = require('express');
const router = express.Router();
const {
    getMyDesignerQuotes,
    getDesignerQuoteById,
    acceptDesignerQuote,
    rejectDesignerQuote
} = require('../controllers/designerQuoteController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
    .get(getMyDesignerQuotes);

router.route('/:id')
    .get(getDesignerQuoteById);

router.post('/:id/accept', acceptDesignerQuote);
router.post('/:id/reject', rejectDesignerQuote);

module.exports = router;
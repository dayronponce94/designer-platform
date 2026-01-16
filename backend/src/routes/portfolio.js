const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
    getPortfolioItems,
    getMyPortfolio,
    getPortfolioItem,
    createPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem,
    uploadPortfolioImages
} = require('../controllers/portfolioController');
const { protect, authorize } = require('../middleware/auth');

// Configurar multer para subida de imágenes
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/portfolio/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB límite por imagen
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif, webp)'));
        }
    }
});

// Rutas públicas
router.get('/', getPortfolioItems);


// Todas las rutas siguientes requieren autenticación
router.use(protect);

// Rutas para diseñadores
router.get('/my-portfolio', authorize('designer'), getMyPortfolio);
router.post('/', authorize('designer'), createPortfolioItem);
router.put('/:id', authorize('designer'), updatePortfolioItem);
router.delete('/:id', authorize('designer'), deletePortfolioItem);
router.post('/upload-images', authorize('designer'), upload.array('images', 10), uploadPortfolioImages);

// Ruta pública para obtener item específico
router.get('/:id', getPortfolioItem);

module.exports = router;
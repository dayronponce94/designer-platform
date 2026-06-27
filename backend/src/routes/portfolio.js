const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
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

// Configurar las credenciales de Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configurar Cloudinary Storage para Multer en lugar de DiskStorage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'designer_portfolio', // Nombre de la carpeta que se creará en tu cuenta de Cloudinary
        allowed_formats: ['jpeg', 'jpg', 'png', 'gif', 'webp'],
        public_id: (req, file) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            // Quitamos la extensión del nombre original porque Cloudinary la gestiona sola
            const originalName = path.parse(file.originalname).name;
            return `img-${uniqueSuffix}-${originalName}`;
        }
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB límite por imagen
    }
    // Nota: El fileFilter ya no es estrictamente necesario porque CloudinaryStorage 
    // valida y restringe mediante 'allowed_formats' de forma nativa.
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

// Esta ruta ahora subirá de golpe hasta 10 imágenes directo a la nube sin tocar el disco del servidor
router.post('/upload-images', authorize('designer'), upload.array('images', 10), uploadPortfolioImages);

// Ruta pública para obtener item específico
router.get('/:id', getPortfolioItem);

module.exports = router;
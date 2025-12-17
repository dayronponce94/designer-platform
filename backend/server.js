const app = require('./app');
const connectDB = require('./config/database');
const env = require('./config/env');
const logger = require('./utils/logger');

// Conectar a la base de datos
connectDB();

const server = app.listen(env.PORT, () => {
    logger.info(` Servidor backend ejecutándose en modo ${env.NODE_ENV}`);
    logger.info(` URL: ${env.SERVER_URL}`);
    logger.info(` MongoDB: ${env.MONGODB_URI.split('@')[1] || 'local'}`);
});

// Manejar excepciones no capturadas
process.on('unhandledRejection', (err) => {
    logger.error(` Unhandled Rejection: ${err.message}`);
    logger.error(err.stack);
    server.close(() => process.exit(1));
});

// Manejar excepciones no capturadas
process.on('uncaughtException', (err) => {
    logger.error(` Uncaught Exception: ${err.message}`);
    logger.error(err.stack);
    process.exit(1);
});
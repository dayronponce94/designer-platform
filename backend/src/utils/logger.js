const env = require('../config/env');

const logger = {
    info: (message, ...args) => {
        console.log(`${new Date().toISOString()} - ${message}`, ...args);
    },

    error: (message, ...args) => {
        console.error(`${new Date().toISOString()} - ${message}`, ...args);
    },

    warn: (message, ...args) => {
        console.warn(`${new Date().toISOString()} - ${message}`, ...args);
    },

    debug: (message, ...args) => {
        if (env.NODE_ENV === 'development') {
            console.debug(`${new Date().toISOString()} - ${message}`, ...args);
        }
    }
};

module.exports = logger;
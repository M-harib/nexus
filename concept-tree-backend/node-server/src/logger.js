/**
 * Simple logger utility
 */
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

const levels = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
};

const log = (level, message) => {
    if (levels[level] >= levels[LOG_LEVEL]) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
    }
};

module.exports = {
    debug: (msg) => log('debug', msg),
    info: (msg) => log('info', msg),
    warn: (msg) => log('warn', msg),
    error: (msg) => log('error', msg),
};

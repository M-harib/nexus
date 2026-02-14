/**
 * Flask API client for Node.js server
 */
const axios = require('axios');
const logger = require('./logger');

const FLASK_API_URL = process.env.FLASK_API_URL || 'http://localhost:5000';

const flaskClient = axios.create({
    baseURL: FLASK_API_URL,
    timeout: 5000,
});

// Request interceptor
flaskClient.interceptors.request.use(
    (config) => {
        logger.debug(`Flask API request: ${config.method.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        logger.error(`Flask API request error: ${error.message}`);
        return Promise.reject(error);
    }
);

// Response interceptor
flaskClient.interceptors.response.use(
    (response) => {
        logger.debug(`Flask API response: ${response.status}`);
        return response;
    },
    (error) => {
        logger.error(`Flask API response error: ${error.message}`);
        return Promise.reject(error);
    }
);

module.exports = flaskClient;

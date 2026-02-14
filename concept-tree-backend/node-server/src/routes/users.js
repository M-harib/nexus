/**
 * User routes for Node.js server - proxies to Flask
 */
const express = require('express');
const router = express.Router();
const flaskClient = require('../flaskClient');
const logger = require('../logger');

// Get user skills
router.get('/:user_id/skills', async (req, res) => {
    try {
        const response = await flaskClient.get(`/api/users/${req.params.user_id}/skills`);
        res.status(response.status).json(response.data);
    } catch (error) {
        logger.error(`Error getting user skills: ${error.message}`);
        res.status(error.response?.status || 500).json({
            error: error.message,
        });
    }
});

// Complete concept
router.post('/:user_id/skills/complete', async (req, res) => {
    try {
        const response = await flaskClient.post(
            `/api/users/${req.params.user_id}/skills/complete`,
            req.body
        );
        res.status(response.status).json(response.data);
    } catch (error) {
        logger.error(`Error completing concept: ${error.message}`);
        res.status(error.response?.status || 500).json({
            error: error.message,
        });
    }
});

// Start concept
router.post('/:user_id/skills/start', async (req, res) => {
    try {
        const response = await flaskClient.post(
            `/api/users/${req.params.user_id}/skills/start`,
            req.body
        );
        res.status(response.status).json(response.data);
    } catch (error) {
        logger.error(`Error starting concept: ${error.message}`);
        res.status(error.response?.status || 500).json({
            error: error.message,
        });
    }
});

// Get available concepts
router.get('/:user_id/available-concepts', async (req, res) => {
    try {
        const response = await flaskClient.get(
            `/api/users/${req.params.user_id}/available-concepts`
        );
        res.status(response.status).json(response.data);
    } catch (error) {
        logger.error(`Error getting available concepts: ${error.message}`);
        res.status(error.response?.status || 500).json({
            error: error.message,
        });
    }
});

// Get blocked concepts
router.get('/:user_id/blocked-concepts', async (req, res) => {
    try {
        const response = await flaskClient.get(
            `/api/users/${req.params.user_id}/blocked-concepts`
        );
        res.status(response.status).json(response.data);
    } catch (error) {
        logger.error(`Error getting blocked concepts: ${error.message}`);
        res.status(error.response?.status || 500).json({
            error: error.message,
        });
    }
});

// Export skill tree
router.get('/:user_id/export', async (req, res) => {
    try {
        const response = await flaskClient.get(`/api/users/${req.params.user_id}/export`);
        res.status(response.status).json(response.data);
    } catch (error) {
        logger.error(`Error exporting skill tree: ${error.message}`);
        res.status(error.response?.status || 500).json({
            error: error.message,
        });
    }
});

// Import skill tree
router.post('/:user_id/import', async (req, res) => {
    try {
        const response = await flaskClient.post(
            `/api/users/${req.params.user_id}/import`,
            req.body
        );
        res.status(response.status).json(response.data);
    } catch (error) {
        logger.error(`Error importing skill tree: ${error.message}`);
        res.status(error.response?.status || 500).json({
            error: error.message,
        });
    }
});

module.exports = router;

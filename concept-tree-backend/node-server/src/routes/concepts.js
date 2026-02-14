/**
 * Concept routes for Node.js server - proxies to Flask
 */
const express = require('express');
const router = express.Router();
const flaskClient = require('../flaskClient');
const logger = require('../logger');

// Create concept
router.post('/', async (req, res) => {
    try {
        const response = await flaskClient.post('/api/concepts', req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        logger.error(`Error creating concept: ${error.message}`);
        res.status(error.response?.status || 500).json({
            error: error.message,
        });
    }
});

// List concepts
router.get('/', async (req, res) => {
    try {
        const response = await flaskClient.get('/api/concepts', {
            params: req.query,
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        logger.error(`Error listing concepts: ${error.message}`);
        res.status(error.response?.status || 500).json({
            error: error.message,
        });
    }
});

// Get concept
router.get('/:concept_id', async (req, res) => {
    try {
        const response = await flaskClient.get(`/api/concepts/${req.params.concept_id}`);
        res.status(response.status).json(response.data);
    } catch (error) {
        logger.error(`Error getting concept: ${error.message}`);
        res.status(error.response?.status || 500).json({
            error: error.message,
        });
    }
});

// Update concept
router.put('/:concept_id', async (req, res) => {
    try {
        const response = await flaskClient.put(
            `/api/concepts/${req.params.concept_id}`,
            req.body
        );
        res.status(response.status).json(response.data);
    } catch (error) {
        logger.error(`Error updating concept: ${error.message}`);
        res.status(error.response?.status || 500).json({
            error: error.message,
        });
    }
});

// Delete concept
router.delete('/:concept_id', async (req, res) => {
    try {
        const response = await flaskClient.delete(`/api/concepts/${req.params.concept_id}`);
        res.status(response.status).json(response.data);
    } catch (error) {
        logger.error(`Error deleting concept: ${error.message}`);
        res.status(error.response?.status || 500).json({
            error: error.message,
        });
    }
});

// Get dependencies
router.get('/:concept_id/dependencies', async (req, res) => {
    try {
        const response = await flaskClient.get(
            `/api/concepts/${req.params.concept_id}/dependencies`
        );
        res.status(response.status).json(response.data);
    } catch (error) {
        logger.error(`Error getting dependencies: ${error.message}`);
        res.status(error.response?.status || 500).json({
            error: error.message,
        });
    }
});

// Get dependents
router.get('/:concept_id/dependents', async (req, res) => {
    try {
        const response = await flaskClient.get(
            `/api/concepts/${req.params.concept_id}/dependents`
        );
        res.status(response.status).json(response.data);
    } catch (error) {
        logger.error(`Error getting dependents: ${error.message}`);
        res.status(error.response?.status || 500).json({
            error: error.message,
        });
    }
});

module.exports = router;

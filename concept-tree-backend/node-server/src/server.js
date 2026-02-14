/**
 * Main Node.js server with Express
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('./logger');
const { connectDB } = require('./db');
const conceptRoutes = require('./routes/concepts');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    logger.debug(`${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/concepts', conceptRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        service: 'Concept Dependency Tree Node Server',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        name: 'Concept Dependency Tree Node.js Server',
        version: '1.0.0',
        role: 'Integration layer between Flask backend and MongoDB',
        endpoints: {
            '/api/concepts': 'Concept management routes',
            '/api/users': 'User skill management routes',
            '/health': 'Health check endpoint',
        },
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        path: req.path,
    });
});

// Error handler
app.use((err, req, res, next) => {
    logger.error(`Unhandled error: ${err.message}`);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message,
    });
});

// Start server
const startServer = async () => {
    try {
        await connectDB();
        
        app.listen(PORT, () => {
            logger.info(`✓ Node.js server running on http://localhost:${PORT}`);
            logger.info(`  Flask API: ${process.env.FLASK_API_URL || 'http://localhost:5000'}`);
            logger.info(`  MongoDB: ${process.env.MONGO_URI || 'mongodb://localhost:27017/concept-tree'}`);
            logger.info('');
            logger.info('Available endpoints:');
            logger.info('  POST   /api/concepts');
            logger.info('  GET    /api/concepts');
            logger.info('  GET    /api/concepts/:concept_id');
            logger.info('  PUT    /api/concepts/:concept_id');
            logger.info('  DELETE /api/concepts/:concept_id');
            logger.info('  GET    /api/concepts/:concept_id/dependencies');
            logger.info('  GET    /api/concepts/:concept_id/dependents');
            logger.info('  GET    /api/users/:user_id/skills');
            logger.info('  POST   /api/users/:user_id/skills/complete');
            logger.info('  POST   /api/users/:user_id/skills/start');
            logger.info('  GET    /api/users/:user_id/available-concepts');
            logger.info('  GET    /api/users/:user_id/blocked-concepts');
            logger.info('  GET    /api/users/:user_id/export');
            logger.info('  POST   /api/users/:user_id/import');
        });
    } catch (error) {
        logger.error(`Failed to start server: ${error.message}`);
        process.exit(1);
    }
};

startServer();

module.exports = app;

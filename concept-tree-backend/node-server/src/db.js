/**
 * MongoDB connection manager for Node.js server
 */
const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/concept-tree';
        
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        logger.info(`✓ Connected to MongoDB at ${mongoUri}`);
        return mongoose.connection;
    } catch (error) {
        logger.error(`✗ MongoDB connection failed: ${error.message}`);
        process.exit(1);
    }
};

const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        logger.info('✓ Disconnected from MongoDB');
    } catch (error) {
        logger.error(`Error disconnecting from MongoDB: ${error.message}`);
    }
};

module.exports = {
    connectDB,
    disconnectDB,
};

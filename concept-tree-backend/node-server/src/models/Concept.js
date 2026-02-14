/**
 * Concept model for MongoDB (Node.js)
 */
const mongoose = require('mongoose');

const ConceptSchema = new mongoose.Schema({
    concept_id: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    category: {
        type: String,
        index: true,
    },
    difficulty_level: {
        type: Number,
        default: 1,
        min: 1,
        max: 10,
    },
    prerequisites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Concept',
    }],
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
    is_archived: {
        type: Boolean,
        default: false,
    },
});

// Update timestamp on save
ConceptSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model('Concept', ConceptSchema);

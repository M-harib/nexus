/**
 * User Skills model for MongoDB (Node.js)
 */
const mongoose = require('mongoose');

const UserSkillSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    skill_tree_name: {
        type: String,
        default: 'default',
    },
    completed_concepts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Concept',
    }],
    in_progress_concepts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Concept',
    }],
    verified_skills: {
        type: Map,
        of: String,
        default: new Map(),
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});

// Update timestamp on save
UserSkillSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model('UserSkill', UserSkillSchema);

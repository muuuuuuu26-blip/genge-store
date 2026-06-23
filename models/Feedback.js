const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    name: { type: String, default: 'Mteja (Bila Jina)' },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema);

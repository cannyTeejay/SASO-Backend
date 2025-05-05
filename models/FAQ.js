const mongoose = require('mongoose');

const FAQSchema = new mongoose.Schema({
    message_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', required: true },
    question: {type: String, required: true},
    answer: {type: String, required: true},
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    last_updated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('FAQ', FAQSchema);
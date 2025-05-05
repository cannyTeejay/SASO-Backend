const mongoose = require('mongoose');

const SupportRequestSchema = new mongoose.Schema({
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    subject: {type: String, required: true },
    message: {type: String, required: true },
    status: { type: String, enum: ['open','in_progress','resolved','closed'] , default: 'open' },
    created_at: { type: Date, default: Date.now },
},{timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}});

module.exports = mongoose.model('SupportRequest', SupportRequestSchema);
const mongoose = require('mongoose');

const SupportRequestSchema = new mongoose.Schema({
  request_id: { type: Number, required: true, unique: true },
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Resolved'], default: 'Pending' },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SupportRequest', SupportRequestSchema);
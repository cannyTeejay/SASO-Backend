const mongoose = require('mongoose');

const AdminActivityLogSchema = new mongoose.Schema({
  log_id: { type: Number, required: true, unique: true },
  admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  activity_type: { type: String, required: true },
  description: { type: String },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('AdminActivityLog', AdminActivityLogSchema);
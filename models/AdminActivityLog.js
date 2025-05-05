const mongoose = require('mongoose');

const AdminActivityLogSchema = new mongoose.Schema({
    admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    activity_type: String,
    description: String,
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('AdminActivityLog', AdminActivityLogSchema);
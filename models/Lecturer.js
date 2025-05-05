const mongoose = require('mongoose');

const LecturerSchema = new mongoose.Schema({
    lecturer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: {type: String, required: true},
});

module.exports = mongoose.model('Lecturer', LecturerSchema);
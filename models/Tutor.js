const mongoose = require('mongoose');

const TutorSchema = new mongoose.Schema({
    tutor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    specialization: [String],
});

module.exports = mongoose.model('Tutor', TutorSchema);
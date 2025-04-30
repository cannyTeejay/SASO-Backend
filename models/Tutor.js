const mongoose = require('mongoose');

const TutorSchema = new mongoose.Schema({
  tutor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specializations: { type: String },
});
const Tutor = mongoose.model('Tutor', TutorSchema);
module.exports = Tutor;
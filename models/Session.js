const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  session_id: { type: Number, required: true, unique: true },
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  instructor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  session_type: { type: String, enum: ['Lecture', 'Tutorial'], required: true },
  date_time: { type: Date, required: true },
  location_or_link: { type: String },
  is_online: { type: Boolean, default: false },
});

module.exports = mongoose.model('Session', SessionSchema);
const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  attendance_id: { type: Number, required: true, unique: true },
  session_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Present', 'Absent', 'Excused'], required: true },
  markedBy: {type: mongoose.Types.ObjectId, ref:"Lecturer"}
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
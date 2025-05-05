const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    session_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    status: { type: String, enum: ['present', 'absent', 'late'], required: true },
},{timestamps: true});

//Prevent duplicate attendance records for the same session and student
AttendanceSchema.index({ session_id: 1, student_id: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
const mongoose = require('mongoose');

const LecturerCourseSchema = new mongoose.Schema({
    lecturer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Lecturer', required: true },
    course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
});

module.exports = mongoose.model('LecturerCourse', LecturerCourseSchema);
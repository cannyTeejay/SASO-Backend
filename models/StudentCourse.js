const mongoose = require('mongoose');

const StudentCourseSchema = new mongoose.Schema({
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
});

module.exports = mongoose.model('StudentCourse', StudentCourseSchema);
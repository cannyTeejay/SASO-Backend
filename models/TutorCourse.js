const mongoose = require('mongoose');

const TutorCourseSchema = new mongoose.Schema({
    tutor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor', required: true },
    course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
});

module.exports = mongoose.model('TutorCourse', TutorCourseSchema);
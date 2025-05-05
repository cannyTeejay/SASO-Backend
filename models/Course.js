const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    course_name: {type: String, required: true},
    course_code: {type: String, required: true, unique: true,uppercase: true},
    department: {type: String, required: true},
},{timestamps: true});

module.exports = mongoose.model('Course', CourseSchema);
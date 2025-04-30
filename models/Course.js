const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  course_id: { type: Number, required: true, unique: true },
  course_name: { type: String, required: true },
  course_code: { type: String, required: true },
  department: { type: String },
});

module.exports = mongoose.model('Course', CourseSchema);
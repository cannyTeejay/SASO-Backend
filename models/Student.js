const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  enrollment_year: { type: Number, required: true },
});

const Student = mongoose.model('Student', StudentSchema);
module.exports = Student;
// The student_id field is a reference to the User model, indicating that each student is also a user.
// The enrollment_year field is a number that indicates the year the student enrolled in the institution.
// This field is required, meaning that it must be provided when creating a new Student document.
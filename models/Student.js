const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    enrollment_year: Number,
});

module.exports = mongoose.model('Student', StudentSchema);
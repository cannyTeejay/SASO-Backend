const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
    course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    instructor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    session_type: {type: String, required: true},
    date_time: {type: Date, required: true},
    location_or_link: {type: String, required: true},
    is_online: {type: Boolean, required: true},
},{timestamps: true});

module.exports = mongoose.model('Session', SessionSchema);
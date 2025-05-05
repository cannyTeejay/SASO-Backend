const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    role: { type: String, enum: ['student', 'tutor', 'lecturer', 'admin'], required: true },
    first_name: String,
    last_name: String,
    faculty: String,
    campus: String,
    department: String,
});

module.exports = mongoose.model('User', UserSchema);
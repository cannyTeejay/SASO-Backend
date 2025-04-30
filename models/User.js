const mongoose = require('mongoose');
const {isEmail} = require('validator');

const UserSchema = new mongoose.Schema({
  user_id: { type: Number, required: [true, 'Please Provide Your ID'], unique: true },
  email: { 
    type: String, 
    required: [true, 'Please Provide Your Email Address'], 
    unique: true,
    validate: [isEmail, 'Please Provide A Valid Email Address']
  },
  password_hash: { type: String, required: [true, 'Please Provide A Password'] },
  role: { type: String, enum: ['Student', 'Tutor', 'Lecturer', 'Admin'], required: [true, 'Please Provide Your Role'] },
  first_name: { type: String },
  last_name: { type: String },
  faculty: { type: String },
  campus: { type: String },
  department: { type: String },
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
// This model defines the structure of the User document in MongoDB.
// It includes fields for user_id, email, password_hash, role, first_name, last_name, faculty, campus, and department.
// The user_id is a unique identifier for each user, and the email must also be unique.
// The role field can be one of four values: Student, Tutor, Lecturer, or Admin.
// The first_name, last_name, faculty, campus, and department fields are optional.
// The User model is then exported for use in other parts of the application.
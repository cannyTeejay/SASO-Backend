const mongoose = require('mongoose');

const LecturerSchema = new mongoose.Schema({
  lecturer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String },
});
// The lecturer_id field is a reference to the User model, indicating that each lecturer is also a user.
// The title field is a string that can be used to store the lecturer's title (e.g., Dr., Prof., etc.). 
const Lecturer = mongoose.model('Lecturer', LecturerSchema);
module.exports = Lecturer;
const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  view_analitics: { type: Boolean, default: false },
});
// The admin_id field is a reference to the User model, indicating that each admin is also a user.
// The view_analitics field is a boolean that indicates whether the admin has permission to view analytics.
// The default value is set to false, meaning that by default, admins do not have this permission unless explicitly granted.
const Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;
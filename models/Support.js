import mongoose from "mongoose";

const supportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  subject: String,
  query: String,
  response: String,
  status: { type: String, enum: ['open', 'resolved'], default: 'open' }
}, { timestamps: true });

module.exports = mongoose.model("Support", supportSchema);
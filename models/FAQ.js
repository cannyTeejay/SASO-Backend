const mongoose = require('mongoose');

const FAQSchema = new mongoose.Schema({
  faq_id: { type: Number, required: true, unique: true },
  question: { type: String, required: true },
  answer: { type: String },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  last_updated: { type: Date },
});

module.exports = mongoose.model('FAQ', FAQSchema);
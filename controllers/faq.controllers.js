import FAQ from '../models/faq.model.js';

exports.getAllFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find().populate('userID', 'name role');
    res.status(200).json(faqs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const newFAQ = await FAQ.create({
      userID: req.user._id,
      question,
      answer
    });
    res.status(201).json(newFAQ);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
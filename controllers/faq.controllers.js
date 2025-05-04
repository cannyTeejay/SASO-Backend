import FAQ from '../models/FAQ.js';

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

exports.getFAQById = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id).populate('userID', 'name');
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
      res.json(faq);
  }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.updateFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;

    const updated = await FAQ.findByIdAndUpdate(
      id,
      { answer },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "FAQ not found." });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await FAQ.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "FAQ not found." });
    }
    res.json({ message: "FAQ deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
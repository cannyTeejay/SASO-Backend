const FAQ = require('../models/FAQ');

exports.createFAQ = async (req, res) => {
    try {
        const newFAQ = new FAQ(req.body);
        const savedFAQ = await newFAQ.save();
        res.status(201).json(savedFAQ);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllFAQs = async (req, res) => {
    try {
        const faqs = await FAQ.find()
            .populate('message_id')                // Includes message content + timestamp
            .populate('created_by', 'name email'); // only select user name and email
        res.status(200).json(faqs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getFAQById = async (req, res) => {
    try {
        const faq = await FAQ.findById(req.params.id).populate('message_id').populate('created_by');
        if (!faq) return res.status(404).json({ message: "FAQ not found" });
        res.status(200).json(faq);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateFAQ = async (req, res) => {
    try {
        req.body.last_updated = Date.now();
        const updatedFAQ = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedFAQ) return res.status(404).json({ message: "FAQ not found" });
        res.status(200).json(updatedFAQ);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteFAQ = async (req, res) => {
    try {
        const deletedFAQ = await FAQ.findByIdAndDelete(req.params.id);
        if (!deletedFAQ) return res.status(404).json({ message: "FAQ not found" });
        res.status(200).json({ message: "FAQ deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
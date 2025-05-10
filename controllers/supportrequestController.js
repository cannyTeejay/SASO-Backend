const SupportRequest = require('../models/SupportRequest');

exports.createSupportRequest = async (req, res) => {
    try {
        const newSupport = new SupportRequest(req.body);
        const savedSupport= await newSupport.save();
        const populatedSupport = await SupportRequest.findById(savedSupport._id).populate('student_id'); //populate after save
        res.status(201).json(savedSupport);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllSupportRequests = async (req, res) => {
    try {
        const supports = await SupportRequest.find().populate('student_id');
        res.status(200).json(supports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getSupportRequestById = async (req, res) => {
    try {
        const support = await SupportRequest.findById(req.params.id).populate('student_id');
        if (!support) return res.status(404).json({ message: "SupportRequest not found" });
        res.status(200).json(support);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateSupportRequest = async (req, res) => {
    try {
        const updatedSupport = await SupportRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedSupport) return res.status(404).json({ message: "SupportRequest not found" });
        res.status(200).json(updatedSupport);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteSupportRequest = async (req, res) => {
    try {
        const deletedSupport = await SupportRequest.findByIdAndDelete(req.params.id);
        if (!deletedSupport) return res.status(404).json({ message: "SupportRequest not found" });
        res.status(200).json({ message: "SupportRequest deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
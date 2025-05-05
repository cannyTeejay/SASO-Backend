const Tutor = require('../models/Tutor');

exports.createTutor = async (req, res) => {
    try {
        const newTutor = new Tutor(req.body);
        const savedTutor = await newTutor.save();
        res.status(201).json(savedTutor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllTutors = async (req, res) => {
    try {
        const tutors = await Tutor.find().populate('tutor_id');
        res.status(200).json(tutors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTutorById = async (req, res) => {
    try {
        const tutor = await Tutor.findById(req.params.id).populate('tutor_id');
        if (!tutor) return res.status(404).json({ message: "Tutor not found" });
        res.status(200).json(tutor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateTutor = async (req, res) => {
    try {
        const updatedTutor = await Tutor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTutor) return res.status(404).json({ message: "Tutor not found" });
        res.status(200).json(updatedTutor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteTutor = async (req, res) => {
    try {
        const deletedTutor = await Tutor.findByIdAndDelete(req.params.id);
        if (!deletedTutor) return res.status(404).json({ message: "Tutor not found" });
        res.status(200).json({ message: "Tutor deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
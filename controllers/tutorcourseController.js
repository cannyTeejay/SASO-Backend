const TutorCourse = require('../models/TutorCourse');

exports.createTutorCourse = async (req, res) => {
    try {
        const newTutorCourse = new TutorCourse(req.body);
        const savedTutorCourse = await newTutorCourse.save();
        res.status(201).json(savedTutorCourse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllTutorCourses = async (req, res) => {
    try {
        const tutorCourses = await TutorCourse.find().populate('tutor_id').populate('course_id');
        res.status(200).json(tutorCourses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTutorCourseById = async (req, res) => {
    try {
        const tutorCourse = await TutorCourse.findById(req.params.id).populate('tutor_id').populate('course_id');
        if (!tutorCourse) return res.status(404).json({ message: "TutorCourse not found" });
        res.status(200).json(tutorCourse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateTutorCourse = async (req, res) => {
    try {
        const updatedTutorCourse = await TutorCourse.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTutorCourse) return res.status(404).json({ message: "TutorCourse not found" });
        res.status(200).json(updatedTutorCourse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteTutorCourse = async (req, res) => {
    try {
        const deletedTutorCourse = await TutorCourse.findByIdAndDelete(req.params.id);
        if (!deletedTutorCourse) return res.status(404).json({ message: "TutorCourse not found" });
        res.status(200).json({ message: "TutorCourse deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
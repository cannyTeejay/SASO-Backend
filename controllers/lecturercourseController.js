const LecturerCourse = require('../models/LecturerCourse');

exports.createLecturerCourse = async (req, res) => {
    try {
        const { lecturer_id, course_id } = req.body;

        // Check if lecturer exists
        const lecturer = await Lecturer.findById(lecturer_id);
        if (!lecturer) {
            return res.status(404).json({ message: 'Lecturer not found' });
        }

        // Check if course exists
        const course = await Course.findById(course_id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Create and save new LecturerCourse
        const newLecturerCourse = new LecturerCourse({ lecturer_id, course_id, start_date, end_date });
        const savedLecturerCourse = await newLecturerCourse.save();

        res.status(201).json(savedLecturerCourse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllLecturerCourses = async (req, res) => {
    try {
        const items = await LecturerCourse.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getLecturerCourseById = async (req, res) => {
    try {
        const item = await LecturerCourse.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "LecturerCourse not found" });
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateLecturerCourse = async (req, res) => {
    try {
        const updatedItem = await LecturerCourse.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedItem) return res.status(404).json({ message: "LecturerCourse not found" });
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteLecturerCourse = async (req, res) => {
    try {
        const deletedItem = await LecturerCourse.findByIdAndDelete(req.params.id);
        if (!deletedItem) return res.status(404).json({ message: "LecturerCourse not found" });
        res.status(200).json({ message: "LecturerCourse deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
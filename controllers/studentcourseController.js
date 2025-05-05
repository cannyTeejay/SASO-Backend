const StudentCourse = require('../models/StudentCourse');

exports.createStudentCourse = async (req, res) => {
    try {
        const newtudentCourse = new StudentCourse(req.body);
        const savedStudentCourse = await newtudentCourse.save();
        res.status(201).json(savedStudentCourse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllStudentCourses = async (req, res) => {
    try {
        const courses = await StudentCourse.find().populate('student_id').populate('course_id');
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getStudentCourseById = async (req, res) => {
    try {
        const course = await StudentCourse.findById(req.params.id).populate('student_id').populate('course_id');
        if (!course) return res.status(404).json({ message: "StudentCourse not found" });
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateStudentCourse = async (req, res) => {
    try {
        const updatedCourse = await StudentCourse.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCourse) return res.status(404).json({ message: "StudentCourse not found" });
        res.status(200).json(updatedCourse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteStudentCourse = async (req, res) => {
    try {
        const deletedCourse = await StudentCourse.findByIdAndDelete(req.params.id);
        if (!deletedCourse) return res.status(404).json({ message: "StudentCourse not found" });
        res.status(200).json({ message: "StudentCourse deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const Student = require('../models/Student');

exports.createStudent = async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        const savedStudent= await newStudent.save();
        res.status(201).json(savedStudent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().populate('student_id');
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate('student_id');
        if (!student) return res.status(404).json({ message: "Student not found" });
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateStudent = async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedStudent) return res.status(404).json({ message: "Student not found" });
        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteStudent = async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);
        if (!deletedStudent) return res.status(404).json({ message: "Student not found" });
        res.status(200).json({ message: "Student deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
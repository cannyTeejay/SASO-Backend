const Student = require('../models/Student');
const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.createStudent = async (req, res) => {
    try {
        const { email, password, first_name, last_name, faculty, campus, department, enrollment_year } = req.body;

        if (!email || !password || !first_name || !last_name || !faculty || !campus || !department || !enrollment_year) {
            return res.status(400).json({ message: 'All fields must be provided' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            password: hashedPassword,
            role: 'student',
            first_name,
            last_name,
            faculty,
            campus,
            department,
        });

        const savedUser = await newUser.save();

        const newStudent = new Student({
            student_id: savedUser._id,
            enrollment_year
        });

        const savedStudent = await newStudent.save();

        res.status(201).json({
            message: 'Student and User created successfully',
            student: savedStudent,
            user: savedUser
        });
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
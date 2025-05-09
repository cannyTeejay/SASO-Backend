const Lecturer = require('../models/Lecturer');
const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.createLecturer = async (req, res) => {
    try {
        const { email, password, first_name, last_name, faculty, campus, department, title } = req.body;

        // Validate required fields
        if (!email || !password || !first_name || !last_name || !faculty || !campus || !department || !title) {
            return res.status(400).json({ message: 'All fields must be provided' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User
        const newUser = new User({
            email,
            password: hashedPassword,
            role: 'lecturer',
            first_name,
            last_name,
            faculty,
            campus,
            department,
        });

        const savedUser = await newUser.save();

        // Create Lecturer
        const newLecturer = new Lecturer({
            lecturer_id: savedUser._id,
            title,
        });

        const savedLecturer = await newLecturer.save();

        res.status(201).json({
            message: 'Lecturer and User created successfully',
            lecturer: savedLecturer,
            user: {
                _id: savedUser._id,
                email: savedUser.email,
                first_name: savedUser.first_name,
                last_name: savedUser.last_name,
                role: savedUser.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getAllLecturers = async (req, res) => {
    try {
        const lecturers = await Lecturer.find().populate('lecturer_id');
        res.status(200).json(lecturers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getLecturerById = async (req, res) => {
    try {
        const item = await Lecturer.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "Lecturer not found" });
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateLecturer = async (req, res) => {
    try {
        const updatedItem = await Lecturer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedItem) return res.status(404).json({ message: "Lecturer not found" });
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteLecturer = async (req, res) => {
    try {
        const deletedItem = await Lecturer.findByIdAndDelete(req.params.id);
        if (!deletedItem) return res.status(404).json({ message: "Lecturer not found" });
        res.status(200).json({ message: "Lecturer deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
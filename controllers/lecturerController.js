const Lecturer = require('../models/Lecturer');
const User = require('../models/User');

exports.createLecturer = async (req, res) => {
    try {
        const { email, first_name, last_name, faculty, campus, department, title } = req.body;

        // Validation to ensure all required fields are provided
        if (!email || !first_name || !last_name || !faculty || !campus || !department || !title) {
            return res.status(400).json({ message: 'All fields must be provided' });
        }

        // Check if the User already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Create User object for the Lecturer
        const newUser = new User({
            email,
            role: 'lecturer',
            first_name,
            last_name,
            faculty,
            campus,
            department,
        });

        // Save the User
        const savedUser = await newUser.save();

        // Create Lecturer
        const newLecturer = new Lecturer({
            lecturer_id: savedUser._id,  // Reference to the created User
            title,
        });

        // Save the Lecturer
        const savedLecturer = await newLecturer.save();

        // Return response with saved Lecturer and User
        res.status(201).json({
            message: 'Lecturer and User created successfully',
            lecturer: savedLecturer,
            user: savedUser
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
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
const Tutor = require('../models/Tutor');
const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.createTutor = async (req, res) => {
    try {
        const {
            email,
            password,
            first_name,
            last_name,
            faculty,
            campus,
            department,
            specialization
        } = req.body;

        if (!email || !first_name || !last_name || !faculty || !campus || !department || !specialization) {
            return res.status(400).json({ message: 'All fields must be provided' });
        }

        // Check if User already exists
        let existingUser = await User.findOne({ email });

        let user;
        if (existingUser) {
            if (existingUser.role !== 'tutor') {
                return res.status(400).json({ message: 'User exists but is not a tutor' });
            }

            // Check if Tutor already exists
            const existingTutor = await Tutor.findOne({ tutor_id: existingUser._id });
            if (existingTutor) {
                return res.status(400).json({ message: 'Tutor already exists for this user' });
            }

            user = existingUser; // Use the existing user
        } else {
            // Hash password
            if (!password) {
                return res.status(400).json({ message: 'Password must be provided for new user' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new User
            const newUser = new User({
                email,
                password: hashedPassword,
                role: 'tutor',
                first_name,
                last_name,
                faculty,
                campus,
                department
            });

            user = await newUser.save();
        }

        // Create Tutor
        const newTutor = new Tutor({
            tutor_id: user._id,
            specialization
        });

        const savedTutor = await newTutor.save();

        res.status(201).json({
            message: 'Tutor created successfully',
            tutor: savedTutor,
            user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
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
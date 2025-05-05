const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.createUser = async (req, res) => {
    try {
        const { email, password_hash, role, first_name, last_name, faculty, campus, department } = req.body;
        if (!email || !password_hash || !role) {
            return res.status(400).json({ message: "Email, password_hash, and role are required" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password_hash, salt);

        const newUser = new User({
            email,
            password_hash: hashedPassword,
            role,
            first_name,
            last_name,
            faculty,
            campus,
            department
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
        
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const items = await User.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const item = await User.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "User not found" });
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const updatedItem = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedItem) return res.status(404).json({ message: "User not found" });
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const deletedItem = await User.findByIdAndDelete(req.params.id);
        if (!deletedItem) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "User deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
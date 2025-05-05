const Admin = require('../models/Admin');
const User = require('../models/User');
const bcrypt = require('bcrypt');


exports.createAdmin = async (req, res) => {
    try {
        const {
            email,
            password,
            first_name,
            last_name,
            faculty,
            campus,
            department,
            view_analytics
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create User
        const newUser = new User({
            email,
            password_hash: hashedPassword,
            role: 'admin',
            first_name,
            last_name,
            faculty,
            campus,
            department
        });

        const savedUser = await newUser.save();

        // Create Admin and link to user
        const newAdmin = new Admin({
            user: savedUser._id,
            view_analytics: view_analytics ?? false
        });

        const savedAdmin = await newAdmin.save();

        res.status(201).json({
            message: 'Admin created successfully',
            user: savedUser,
            admin: savedAdmin
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllAdmins = async (req, res) => {
    try {
        const items = await Admin.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAdminById = async (req, res) => {
    try {
        const item = await Admin.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "Admin not found" });
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateAdmin = async (req, res) => {
    try {
        const updatedItem = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedItem) return res.status(404).json({ message: "Admin not found" });
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteAdmin = async (req, res) => {
    try {
        const deletedItem = await Admin.findByIdAndDelete(req.params.id);
        if (!deletedItem) return res.status(404).json({ message: "Admin not found" });
        res.status(200).json({ message: "Admin deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
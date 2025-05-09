const Admin = require('../models/Admin');
const User = require('../models/User');
const bcrypt = require('bcrypt');


exports.createAdmin = async (req, res) => {
    try {
        const { email, password, first_name, last_name, faculty, campus, department, view_analytics } = req.body;

        // Validate required fields
        if (!email || !password || !first_name || !last_name || !faculty || !campus || !department) {
            return res.status(400).json({ message: 'All fields must be provided' });
        }

        // Check if the User already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the User
        const newUser = new User({
            email,
            password: hashedPassword,
            role: 'admin',
            first_name,
            last_name,
            faculty,
            campus,
            department,
        });

        const savedUser = await newUser.save();

        // Create the Admin document
        const newAdmin = new Admin({
            user: savedUser._id,  // Reference to the created User
            view_analytics: view_analytics || false,  // Defaulting to false if not provided
        });

        const savedAdmin = await newAdmin.save();

        // Return response with saved Admin and User
        res.status(201).json({
            message: 'Admin and User created successfully',
            admin: savedAdmin,
            user: savedUser
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
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
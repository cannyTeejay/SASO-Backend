const AdminActivityLog = require('../models/AdminActivityLog');

exports.createAdminActivityLog = async (req, res) => {
    try {
        const { admin_id, activity, timestamp } = req.body;

        // Validate required fields
        if (!admin_id || !activity || !timestamp) {
            return res.status(400).json({ message: "Admin ID, activity, and timestamp are required" });
        }

        const newItem = new AdminActivityLog(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllAdminActivityLogs = async (req, res) => {
    try {
        const items = await AdminActivityLog.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAdminActivityLogById = async (req, res) => {
    try {
        const item = await AdminActivityLog.findById(req.params.id).populate('admin_id');
        if (!item) return res.status(404).json({ message: "AdminActivityLog not found" });
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateAdminActivityLog = async (req, res) => {
    try {
        const updatedItem = await AdminActivityLog.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedItem) return res.status(404).json({ message: "AdminActivityLog not found" });
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteAdminActivityLog = async (req, res) => {
    try {
        const deletedItem = await AdminActivityLog.findByIdAndDelete(req.params.id);
        if (!deletedItem) return res.status(404).json({ message: "AdminActivityLog not found" });
        res.status(200).json({ message: "AdminActivityLog deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
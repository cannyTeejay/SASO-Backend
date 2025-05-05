const Attendance = require('../models/Attendance');

exports.createAttendance = async (req, res) => {
    try {
        const newItem = new Attendance(req.body);
        const savedItem = await newItem.save();
        const populatedItem = await savedItem
            .populate('session_id')
            .populate('student_id')
            .execPopulate();

        res.status(201).json(populatedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllAttendances = async (req, res) => {
    try {
        const items = await Attendance.find().populate('session_id').populate('student_id');
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAttendanceById = async (req, res) => {
    try {
        const item = await Attendance.findById(req.params.id).populate('session_id').populate('student_id');
        if (!item) return res.status(404).json({ message: "Attendance not found" });
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateAttendance = async (req, res) => {
    try {
        const updatedItem = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('session_id').populate('student_id');
        if (!updatedItem) return res.status(404).json({ message: "Attendance not found" });
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteAttendance = async (req, res) => {
    try {
        const deletedItem = await Attendance.findByIdAndDelete(req.params.id);
        if (!deletedItem) return res.status(404).json({ message: "Attendance not found" });
        res.status(200).json({ message: "Attendance deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
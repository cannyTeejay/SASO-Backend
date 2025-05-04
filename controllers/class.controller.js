import Class from "../models/Class.js";
import User from "../models/User.js";

// Create a new class
exports.createClass = async (req, res) => {
    try {
        const { tutorID, schedule } = req.body;

        const tutor = await User.findById(tutorID);
        if (!tutor || tutor.role !== "tutor") {
            return res.status(400).json({ message: "Invalid tutor ID" });
        }

        const newClass = new Class({ tutorID, schedule });
        await newClass.save();

        res.status(201).json({ message: "Class created successfully", class: newClass });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Get all classes
exports.getAllClasses = async (req, res) => {
    try {
        const classes = await Class.find().populate("tutorID", "first_name last_name email");
        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching classes" });
    }
};

// Get single class by ID
exports.getClassById = async (req, res) => {
    try {
        const classItem = await Class.findById(req.params.id).populate("tutorID");
        if (!classItem) return res.status(404).json({ message: "Class not found" });

        res.json(classItem);
    } catch (error) {
        res.status(500).json({ message: "Error fetching class" });
    }
};

// Update class
exports.updateClass = async (req, res) => {
    try {
        const { tutorID, schedule } = req.body;

        const updatedClass = await Class.findByIdAndUpdate(
            req.params.id,
            { tutorID, schedule },
            { new: true }
        );

        if (!updatedClass) return res.status(404).json({ message: "Class not found" });

        res.json({ message: "Class updated", class: updatedClass });
    } catch (error) {
        res.status(500).json({ message: "Error updating class" });
    }
};

// Delete class
exports.deleteClass = async (req, res) => {
    try {
        const deleted = await Class.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Class not found" });

        res.json({ message: "Class deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting class" });
    }
};
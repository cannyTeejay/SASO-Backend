const Session = require('../models/Session');

exports.createSession = async (req, res) => {
    try {
        const newSession = new Session(req.body);
        const savedSession = await newSession.save();
        res.status(201).json(savedSession);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllSessions = async (req, res) => {
    try {
        const sessions = await Session.find();
        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getSessionById = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id).populate('course_id', 'course_name course_code').populate('instructor_id', 'name email');
        if (!session) return res.status(404).json({ message: "Session not found" });
        res.status(200).json(session);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateSession = async (req, res) => {
    try {
        const updatedSession = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedSession) return res.status(404).json({ message: "Session not found" });
        res.status(200).json(updatedSession);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteSession = async (req, res) => {
    try {
        const deletedSession = await Session.findByIdAndDelete(req.params.id);
        if (!deletedSession) return res.status(404).json({ message: "Session not found" });
        res.status(200).json({ message: "Session deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
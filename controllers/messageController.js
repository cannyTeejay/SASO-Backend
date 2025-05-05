const Message = require('../models/Message');

exports.createMessage = async (req, res) => {
    try {
        const newMessage = new Message(req.body);
        const savedMessage = await newMessage.save();
        res.status(201).json(savedMessage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllMessages = async (req, res) => {
    try {
        const messages = await Message.find();
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMessageById = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) return res.status(404).json({ message: "Message not found" });
        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateMessage = async (req, res) => {
    try {
        const updatedMessage = await Message.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedMessage) return res.status(404).json({ message: "Message not found" });
        res.status(200).json(updatedMessage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteMessage = async (req, res) => {
    try {
        const deletedMessage = await Message.findByIdAndDelete(req.params.id);
        if (!deletedMessage) return res.status(404).json({ message: "Message not found" });
        res.status(200).json({ message: "Message deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
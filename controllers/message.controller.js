import Message from "../models/Message.js";
import User from "../models/User.js";

// Send a message
exports.sendMessage = async (req, res) => {
    try {
        const { senderID, receiverID, content } = req.body;

        const sender = await User.findById(senderID);
        const receiver = await User.findById(receiverID);

        if (!sender || !receiver) {
            return res.status(404).json({ message: "Sender or Receiver not found" });
        }

        const message = new Message({
            senderID,
            receiverID,
            content,
            timestamp: new Date()
        });

        await message.save();
        res.status(201).json({ message: "Message sent", data: message });
    } catch (error) {
        res.status(500).json({ message: "Error sending message", error });
    }
};

// Get messages sent by a user
exports.getSentMessages = async (req, res) => {
    try {
        const { userID } = req.params;
        const messages = await Message.find({ senderID: userID }).populate("receiverID", "first_name last_name email role");
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving sent messages" });
    }
};

// Get messages received by a user
exports.getReceivedMessages = async (req, res) => {
    try {
        const { userID } = req.params;
        const messages = await Message.find({ receiverID: userID }).populate("senderID", "first_name last_name email role");
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving received messages" });
    }
};
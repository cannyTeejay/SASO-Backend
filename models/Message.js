import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {type: mongoose.Types.ObjectId, ref: "User"},
    receiver: {type: mongoose.Types.ObjectId,ref: "User"},
    subject: String,
    content: String
},{timestamps: true});

module.exports = mongoose.model("Message", messageSchema);
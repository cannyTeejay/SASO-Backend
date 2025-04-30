import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    user: {type: mongoose.Types.ObjectId,ref:"User"},
    title: String,
    message: String,
    isRead: {type:Boolean,default:false}
},{timestamps:true});

module.exports = mongoose.model("Notification", notificationSchema);
import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
    question: String,
    answer: String,
    createdBy: {type: mongoose.Types.ObjectId,ref:"Admin"} 
});

module.exportd = mongoose.model("FAQ", faqSchema);
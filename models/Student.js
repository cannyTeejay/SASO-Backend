import mongoose from "mongoose";    

const studentSchema = new mongoose.Schema({
    user: {type: mongoose.Types.ObjectId, ref:"User",required:true},
    department: {type: mongoose.Types.ObjectId, ref:"Department"},
    studentNumber: Number,
    yearLevel: Number
});

module.exports = mongoose.model('Student', studentSchema);
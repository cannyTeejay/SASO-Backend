import mongoose from "mongoose";
 

const lecturerSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    department: {type: mongoose.Schema.Types.ObjectId, ref:"Department"},
    staffNumber: String
});

module.exports = mongoose.model('Lecturer',lecturerSchema);
import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    student: {type: mongoose.Types.ObjectId, ref: "Student"},
    schedule: {type: mongoose.Types.ObjectId, ref:"Schedule"},
    date: Date,
    status: {type: String,enum: ["present","absent","excused"]},
    markedBy: {type: mongoose.Types.ObjectId, ref:"Lecturer"}
});

module.exports = mongoose.model("Attendance",attendanceSchema);
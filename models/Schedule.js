import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
    courseName: String,
    lecturer: {type: mongoose.Types.ObjectId, ref: "Lecturer"},
    classroom: String,
    dayOfWeek: String,
    startTime: String,
    endTime: String,
});

module.exports = mongoose.model("Schedule", scheduleSchema);
import mongoose from "mongoose";

const facultySchema = {
    facultyName: String,
    campus: {type: mongoose.Types.ObjectId, ref: "Campus"}
};

module.exports = mongoose.model("Faculty", facultySchema);
import mongoose from "mongoose";

const departmentSchema = {
    departmentName: String,
    faculty: {type: mongoose.Types.ObjectId, ref: "Faculty"}
};

module.exports = mongoose.model("Department", departmentSchema);
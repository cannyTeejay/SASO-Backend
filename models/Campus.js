import mongoose from "mongoose";

const campusSchema = {
    campusName: String,
    location: String
};

module.exports = mongoose.model("Campus",campusSchema);
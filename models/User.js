import mongoose, { Collection } from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {type: String,unique:true},
    password: String,
    role: {
        type: String,
        enum: ["student", "lecturer", "tutor","admin"],
        default: "student"
    },
    department: {type: mongoose.Types.ObjectId, ref:'Department'},
    createdAt: {type: Date,default: Date.now},
});

module.exports = mongoose.model("User", userSchema);
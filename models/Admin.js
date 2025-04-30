import mongoose, { model } from "mongoose";


const adminSchema = {
    user: {type: mongoose.Types.ObjectId, ref:"User",required:true},
    adminLevel: String
};

module.exports = mongoose.model('Admin',adminSchema);
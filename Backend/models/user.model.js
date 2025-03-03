import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account", // Reference to Account Schema
    },
    preferences: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Preferences", // Reference to Preferences Schema
    },
    notifications: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notifications", // Reference to Notifications Schema
    },
    billing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Billing", // Reference to Billing Schema
    }
}, { timestamps: true });


const userModel = mongoose.model("User", userSchema);
export default userModel;

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
    },
    dashboard: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dashboard", // Reference to Dashboard Schema
    },
    ideStats: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "IdeStats", // Reference to IdeStats Schema
    },
    lang: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lang", // Reference to Lang Schema
    },
    leader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Leader", // Reference to Leader Schema
    },
    projects: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project", // Reference to Projects Schema
    }
}, { timestamps: true });


const userModel = mongoose.model("User", userSchema);
export default userModel;

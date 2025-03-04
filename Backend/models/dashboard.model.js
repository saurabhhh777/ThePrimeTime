import mongoose from "mongoose";

const dashboardSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ide_stats: { type: mongoose.Schema.Types.ObjectId, ref: "ideStats" },
  git_stats: { type: mongoose.Schema.Types.ObjectId, ref: "gitStats" },
});

const dashboardModel = mongoose.model("dashboard", dashboardSchema);
export default dashboardModel;

import mongoose from "mongoose";

const gitStatsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  total_commits: { type: Number, default: 0 },
  repo_commits: [
    {
      repo_name: { type: String },
      commits: { type: Number, default: 0 },
    },
  ],
});

const gitStatsModel = mongoose.model("gitStats", gitStatsSchema);
export default gitStatsModel;
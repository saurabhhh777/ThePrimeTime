import gitStatsModel from "../models/gitstats.model.js";

export const getGitStats = async (req, res) => {
  try {
    const gitStats = await gitStatsModel.findOne({ user: req.user._id });
    
    if (!gitStats) {
      return res.status(404).json({ message: "Git stats not found" });
    }

    res.status(200).json(gitStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createGitStats = async (req, res) => {
  try {
    const gitStats = await gitStatsModel.create({
      user: req.user._id,
      total_commits: req.body.total_commits || 0,
      repo_commits: req.body.repo_commits || []
    });

    res.status(201).json(gitStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateGitStats = async (req, res) => {
  try {
    const gitStats = await gitStatsModel.findOneAndUpdate(
      { user: req.user._id },
      req.body,
      { new: true }
    );

    if (!gitStats) {
      return res.status(404).json({ message: "Git stats not found" });
    }

    res.status(200).json(gitStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteGitStats = async (req, res) => {
  try {
    const gitStats = await gitStatsModel.findOneAndDelete({ user: req.user._id });

    if (!gitStats) {
      return res.status(404).json({ message: "Git stats not found" });
    }

    res.status(200).json({ message: "Git stats deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

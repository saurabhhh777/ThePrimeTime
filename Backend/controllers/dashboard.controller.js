import dashboardModel from "../models/dashboard.model.js";
import ideStatsModel from "../models/idestats.model.js";
import gitStatsModel from "../models/gitstats.model.js";

export const getDashboard = async (req, res) => {
  try {
    const dashboard = await dashboardModel.findOne({ user: req.user._id })
      .populate('ide_stats')
      .populate('git_stats');
    
    if (!dashboard) {
      return res.status(404).json({ message: "Dashboard not found" });
    }

    res.status(200).json(dashboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createDashboard = async (req, res) => {
  try {
    // Create IDE stats
    const ideStats = await ideStatsModel.create({
      user: req.user._id
    });

    // Create Git stats
    const gitStats = await gitStatsModel.create({
      user: req.user._id
    });

    // Create dashboard with references
    const dashboard = await dashboardModel.create({
      user: req.user._id,
      ide_stats: ideStats._id,
      git_stats: gitStats._id
    });

    res.status(201).json(dashboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDashboard = async (req, res) => {
  try {
    const dashboard = await dashboardModel.findOneAndUpdate(
      { user: req.user._id },
      req.body,
      { new: true }
    );

    if (!dashboard) {
      return res.status(404).json({ message: "Dashboard not found" });
    }

    res.status(200).json(dashboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDashboard = async (req, res) => {
  try {
    const dashboard = await dashboardModel.findOne({ user: req.user._id });
    
    if (!dashboard) {
      return res.status(404).json({ message: "Dashboard not found" });
    }

    // Delete associated stats
    await ideStatsModel.findByIdAndDelete(dashboard.ide_stats);
    await gitStatsModel.findByIdAndDelete(dashboard.git_stats);
    
    // Delete dashboard
    await dashboardModel.findByIdAndDelete(dashboard._id);

    res.status(200).json({ message: "Dashboard deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

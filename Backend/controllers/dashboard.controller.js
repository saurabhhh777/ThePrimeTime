import dashboardModel from "../models/dashboard.model.js";
import ideStatsModel from "../models/idestats.model.js";
import gitStatsModel from "../models/gitstats.model.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Try to find existing dashboard
    let dashboard = await dashboardModel.findOne({ user: userId })
      .populate('ide_stats')
      .populate('git_stats');
    
    // If no dashboard exists, create one
    if (!dashboard) {
      try {
        // Create IDE stats
        const ideStats = await ideStatsModel.create({
          user: userId,
          totalTime: 0,
          sessions: 0,
          projects: []
        });

        // Create Git stats
        const gitStats = await gitStatsModel.create({
          user: userId,
          commits: 0,
          repositories: [],
          contributions: []
        });

        // Create dashboard with references
        dashboard = await dashboardModel.create({
          user: userId,
          ide_stats: ideStats._id,
          git_stats: gitStats._id,
          lastUpdated: new Date()
        });

        // Populate the newly created dashboard
        dashboard = await dashboardModel.findById(dashboard._id)
          .populate('ide_stats')
          .populate('git_stats');
      } catch (createError) {
        console.error('Error creating dashboard:', createError);
        // Return empty dashboard data if creation fails
        return res.status(200).json({
          success: true,
          data: {
            ide_stats: {
              totalTime: 0,
              sessions: 0,
              projects: []
            },
            git_stats: {
              commits: 0,
              repositories: [],
              contributions: []
            },
            lastUpdated: new Date()
          }
        });
      }
    }

    res.status(200).json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching dashboard data",
      error: error.message 
    });
  }
};

export const createDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Check if dashboard already exists
    const existingDashboard = await dashboardModel.findOne({ user: userId });
    if (existingDashboard) {
      return res.status(400).json({ 
        success: false,
        message: "Dashboard already exists for this user" 
      });
    }

    // Create IDE stats
    const ideStats = await ideStatsModel.create({
      user: userId,
      totalTime: 0,
      sessions: 0,
      projects: []
    });

    // Create Git stats
    const gitStats = await gitStatsModel.create({
      user: userId,
      commits: 0,
      repositories: [],
      contributions: []
    });

    // Create dashboard with references
    const dashboard = await dashboardModel.create({
      user: userId,
      ide_stats: ideStats._id,
      git_stats: gitStats._id,
      lastUpdated: new Date()
    });

    res.status(201).json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    console.error('Create dashboard error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

export const updateDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const dashboard = await dashboardModel.findOneAndUpdate(
      { user: userId },
      { ...req.body, lastUpdated: new Date() },
      { new: true }
    ).populate('ide_stats').populate('git_stats');

    if (!dashboard) {
      return res.status(404).json({ 
        success: false,
        message: "Dashboard not found" 
      });
    }

    res.status(200).json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    console.error('Update dashboard error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

export const deleteDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const dashboard = await dashboardModel.findOne({ user: userId });
    
    if (!dashboard) {
      return res.status(404).json({ 
        success: false,
        message: "Dashboard not found" 
      });
    }

    // Delete associated stats
    if (dashboard.ide_stats) {
      await ideStatsModel.findByIdAndDelete(dashboard.ide_stats);
    }
    if (dashboard.git_stats) {
      await gitStatsModel.findByIdAndDelete(dashboard.git_stats);
    }
    
    // Delete dashboard
    await dashboardModel.findByIdAndDelete(dashboard._id);

    res.status(200).json({ 
      success: true,
      message: "Dashboard deleted successfully" 
    });
  } catch (error) {
    console.error('Delete dashboard error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

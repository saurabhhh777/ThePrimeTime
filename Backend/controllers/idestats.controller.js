import ideStatsModel from "../models/idestats.model.js";

export const getIdeStats = async (req, res) => {
  try {
    const ideStats = await ideStatsModel.findOne({ user: req.user._id });
    
    if (!ideStats) {
      return res.status(404).json({ message: "IDE stats not found" });
    }

    res.status(200).json(ideStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createIdeStats = async (req, res) => {
  try {
    const ideStats = await ideStatsModel.create({
      user: req.user._id,
      total_hours_coded: req.body.total_hours_coded || 0,
      yearly_hours: req.body.yearly_hours || 0,
      monthly_hours: req.body.monthly_hours || 0,
      weekly_hours: req.body.weekly_hours || 0,
      daily_hours: req.body.daily_hours || 0,
      daily_logs: req.body.daily_logs || []
    });

    res.status(201).json(ideStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateIdeStats = async (req, res) => {
  try {
    const ideStats = await ideStatsModel.findOneAndUpdate(
      { user: req.user._id },
      req.body,
      { new: true }
    );

    if (!ideStats) {
      return res.status(404).json({ message: "IDE stats not found" });
    }

    res.status(200).json(ideStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteIdeStats = async (req, res) => {
  try {
    const ideStats = await ideStatsModel.findOneAndDelete({ user: req.user._id });

    if (!ideStats) {
      return res.status(404).json({ message: "IDE stats not found" });
    }

    res.status(200).json({ message: "IDE stats deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

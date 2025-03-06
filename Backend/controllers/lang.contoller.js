import languageStatsModel from "../models/lang.model.js";

export const getLanguageStats = async (req, res) => {
  try {
    const languageStats = await languageStatsModel.findOne({ user: req.user._id });
    
    if (!languageStats) {
      return res.status(404).json({ message: "Language stats not found" });
    }

    res.status(200).json(languageStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createLanguageStats = async (req, res) => {
  try {
    const languageStats = await languageStatsModel.create({
      user: req.user._id,
      languages: req.body.languages || []
    });

    res.status(201).json(languageStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLanguageStats = async (req, res) => {
  try {
    const languageStats = await languageStatsModel.findOneAndUpdate(
      { user: req.user._id },
      { languages: req.body.languages },
      { new: true }
    );

    if (!languageStats) {
      return res.status(404).json({ message: "Language stats not found" });
    }

    res.status(200).json(languageStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteLanguageStats = async (req, res) => {
  try {
    const languageStats = await languageStatsModel.findOneAndDelete({ user: req.user._id });

    if (!languageStats) {
      return res.status(404).json({ message: "Language stats not found" });
    }

    res.status(200).json({ message: "Language stats deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

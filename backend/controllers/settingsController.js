const StudioSettings = require("../models/StudioSettings");

const getSettings = async (req, res) => {
  try {
    const studioId = req.studioId;

    let settings = await StudioSettings.findOne({ studio: studioId });

    //  Auto-create default settings if not found
    if (!settings) {
      settings = await StudioSettings.create({
        studio: studioId,
      });
    }

    res.json(settings);
  } catch (err) {
    console.error("Get settings error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateSettings = async (req, res) => {
  try {
    const studioId = req.studioId;

    const updated = await StudioSettings.findOneAndUpdate(
      { studio: studioId },
      req.body,
      { new: true, upsert: true, runValidators: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("Update settings error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};

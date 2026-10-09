const Staff = require("../models/Staff");
const Studio = require("../models/Studio");

/**
 * GET /api/studios/list
 * Public – returns a minimal list of all studios (id + className) for dropdown.
 */
const listStudios = async (req, res) => {
  try {
    const studios = await Studio.find({}, "_id className").lean();
    return res.json(studios);
  } catch (err) {
    console.error("List studios error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/staff/pending
 * Owner only – fetch all pending trainer requests for their studio.
 */
const getPendingStaff = async (req, res) => {
  try {
    // req.studioId is set by authMiddleware; req.role must be 'owner'
    if (req.role !== "owner") {
      return res.status(403).json({ message: "Access denied" });
    }

    const pendingStaff = await Staff.find(
      { studioId: req.studioId, status: "pending" },
      "name email createdAt status"
    ).lean();

    return res.json(pendingStaff);
  } catch (err) {
    console.error("Get pending staff error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * PUT /api/staff/:id/approve
 * Owner only – approve a pending trainer.
 */
const approveStaff = async (req, res) => {
  try {
    if (req.role !== "owner") {
      return res.status(403).json({ message: "Access denied" });
    }

    const staff = await Staff.findOne({
      _id: req.params.id,
      studioId: req.studioId,
    });

    if (!staff) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    staff.status = "approved";
    await staff.save();

    return res.json({ message: "Trainer approved successfully", staff });
  } catch (err) {
    console.error("Approve staff error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * PUT /api/staff/:id/reject
 * Owner only – reject or remove a trainer.
 */
const rejectStaff = async (req, res) => {
  try {
    if (req.role !== "owner") {
      return res.status(403).json({ message: "Access denied" });
    }

    const staff = await Staff.findOne({
      _id: req.params.id,
      studioId: req.studioId,
    });

    if (!staff) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    staff.status = "rejected";
    await staff.save();

    return res.json({ message: "Trainer rejected successfully", staff });
  } catch (err) {
    console.error("Reject staff error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { listStudios, getPendingStaff, approveStaff, rejectStaff };

const express = require("express");
const router = express.Router();
const {
  updateProfile,
  updateNotifications,
  changePassword,
} = require("../controllers/userSettingsController");

const { protect } = require("../middleware/authMiddleware");

router.put("/profile", protect, updateProfile);
router.put("/notifications", protect, updateNotifications);
router.put("/change-password", protect, changePassword);

module.exports = router;
const express = require("express");
const router = express.Router();
const {
  generateReport,
  getReportHistory,
} = require("../controllers/reportController");
const { protect } = require("../middleware/authMiddleware");

router.post("/generate", protect, generateReport);
router.get("/history", protect, getReportHistory);

module.exports = router;
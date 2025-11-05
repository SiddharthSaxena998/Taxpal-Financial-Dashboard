const express = require("express");
const router = express.Router();
const {
  generateReport,
  getReportHistory,
  downloadReport,
  deleteReport,
} = require("../controllers/reportController");
const { protect } = require("../middleware/authMiddleware");

router.post("/generate", protect, generateReport);
router.get("/history", protect, getReportHistory);
router.get("/download/:reportId", protect, downloadReport);
router.delete("/delete/:reportId", protect, deleteReport);

module.exports = router;
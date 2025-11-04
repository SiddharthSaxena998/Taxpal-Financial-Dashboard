const express = require("express");
const router = express.Router();
const {
  getCalendarEvents,
  addCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} = require("../controllers/calendarController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getCalendarEvents);
router.post("/", protect, addCalendarEvent);
router.put("/:id", protect, updateCalendarEvent);
router.delete("/:id", protect, deleteCalendarEvent);

module.exports = router;
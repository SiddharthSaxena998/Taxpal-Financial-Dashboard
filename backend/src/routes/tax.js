const express = require("express");
const router = express.Router();
const { calculateTax, getTaxHistory } = require("../controllers/taxController");
const { protect } = require("../middleware/authMiddleware");

router.post("/estimate", protect, calculateTax);
router.get("/history", protect, getTaxHistory);

module.exports = router;
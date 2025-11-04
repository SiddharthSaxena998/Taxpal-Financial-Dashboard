const express = require("express");
const router = express.Router();
const {
  addBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
} = require("../controllers/budgetController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, addBudget);
router.get("/", protect, getBudgets);
router.get("/:id", protect, getBudgetById);
router.put("/:id", protect, updateBudget);
router.delete("/:id", protect, deleteBudget);

module.exports = router;
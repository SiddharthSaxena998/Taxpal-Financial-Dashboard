const express = require("express");
const router = express.Router();

const {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getSuggestions,
} = require("../controllers/categoryController");
const { protect } = require("../middleware/authMiddleware");

router.get("/suggestions", protect, getSuggestions);
router.post("/", protect, addCategory);
router.get("/", protect, getCategories);
router.put("/:id", protect, updateCategory);
router.delete("/:id", protect, deleteCategory);

module.exports = router;
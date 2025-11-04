const Category = require("../models/categoryModel");

const addCategory = (req, res) => {
  const { name, type } = req.body;
  const user_id = req.user.id;

  if (!name || !type || !["income", "expense"].includes(type)) {
    return res.status(400).json({
      message: "Name and a valid type (income/expense) are required.",
    });
  }

  Category.createCategory({ user_id, name, type }, (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res
          .status(409)
          .json({ message: "This category already exists." });
      }
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(201).json({
      message: "Category created successfully!",
      categoryId: result.insertId,
    });
  });
};

const getCategories = (req, res) => {
  const user_id = req.user.id;

  Category.getCategoriesByUser(user_id, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    const organizedCategories = {
      income: results.filter((cat) => cat.type === "income"),
      expense: results.filter((cat) => cat.type === "expense"),
    };
    res.status(200).json(organizedCategories);
  });
};

const updateCategory = (req, res) => {
  const categoryId = req.params.id;
  const user_id = req.user.id;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required." });
  }

  Category.updateCategoryById(categoryId, user_id, { name }, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Category not found or user not authorized." });
    }
    res.status(200).json({ message: "Category updated successfully." });
  });
};

const deleteCategory = (req, res) => {
  const categoryId = req.params.id;
  const user_id = req.user.id;

  Category.deleteCategoryById(categoryId, user_id, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Category not found or user not authorized." });
    }
    res.status(200).json({ message: "Category deleted successfully." });
  });
};

const getSuggestions = (req, res) => {
  const user_id = req.user.id;

  Category.getCategorySuggestions(user_id, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
};

module.exports = {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getSuggestions,
};
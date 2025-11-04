const Budget = require("../models/budgetModel");

const addBudget = (req, res) => {
  const { category, amount, month, description } = req.body;
  const user_id = req.user.id;

  if (!category || !amount || !month) {
    return res
      .status(400)
      .json({ message: "Category, amount, and month are required" });
  }

  const newBudget = {
    user_id,
    category,
    amount,
    month,
    description: description || null,
  };

  Budget.createBudget(newBudget, (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res
          .status(409)
          .json({
            message: "A budget for this category and month already exists.",
          });
      }
      return res.status(500).json({ message: "Database error", error: err });
    }
    res
      .status(201)
      .json({
        message: "Budget created successfully!",
        budgetId: result.insertId,
      });
  });
};

const getBudgets = (req, res) => {
  const user_id = req.user.id;
  const { month } = req.query;

  if (month) {
    Budget.getBudgetsByMonth(user_id, month, (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }
      res.status(200).json(results);
    });
  } else {
    Budget.getAllBudgets(user_id, (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }
      res.status(200).json(results);
    });
  }
};

const getBudgetById = (req, res) => {
  const budgetId = req.params.id;
  const user_id = req.user.id;

  Budget.getBudgetById(budgetId, user_id, (err, results) => {
    if (err)
      return res.status(500).json({ message: "Database error", error: err });
    if (results.length === 0)
      return res
        .status(404)
        .json({ message: "Budget not found or user not authorized" });

    res.status(200).json(results[0]);
  });
};

const updateBudget = (req, res) => {
  const budgetId = req.params.id;
  const user_id = req.user.id;
  const { category, amount, description } = req.body;

  if (!category || !amount) {
    return res
      .status(400)
      .json({ message: "Category and amount are required" });
  }

  const updatedData = { category, amount, description: description || null };

  Budget.updateBudgetById(budgetId, user_id, updatedData, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Budget not found or user not authorized" });
    }
    res.status(200).json({ message: "Budget updated successfully" });
  });
};

const deleteBudget = (req, res) => {
  const budgetId = req.params.id;
  const user_id = req.user.id;

  Budget.deleteBudgetById(budgetId, user_id, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Budget not found or user not authorized" });
    }
    res.status(200).json({ message: "Budget deleted successfully" });
  });
};

module.exports = {
  addBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
};
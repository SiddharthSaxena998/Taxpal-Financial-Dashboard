const Transaction = require("../models/transactionModel");

const addTransaction = (req, res) => {
  const { type, description, amount, category, notes, date } = req.body;
  const user_id = req.user.id;

  if (!type || !description || !amount || !category || !date) {
    return res.status(400).json({ message: "Please fill all required fields" });
  }

  const newTransaction = {
    user_id,
    type,
    description,
    amount,
    category,
    notes: notes || null,
    date,
  };

  Transaction.createTransaction(newTransaction, (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res
          .status(409)
          .json({ message: "This transaction already exists." });
      }
      return res
        .status(500)
        .json({
          message: "Database error while adding transaction",
          error: err,
        });
    }

    res
      .status(201)
      .json({
        message: "Transaction added successfully!",
        transactionId: result.insertId,
      });
  });
};

const getTransactions = (req, res) => {
  const user_id = req.user.id;
  const { type } = req.query;

  Transaction.getTransactionsByUserId(user_id, type, (err, results) => {
    if (err)
      return res
        .status(500)
        .json({
          message: "Database error while fetching transactions",
          error: err,
        });
    res.status(200).json(results);
  });
};

const getTransactionById = (req, res) => {
  const transactionId = req.params.id;
  const userId = req.user.id;

  Transaction.getTransactionById(transactionId, userId, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "Transaction not found or user not authorized" });
    }
    res.status(200).json(results[0]);
  });
};

const updateTransaction = (req, res) => {
  const transactionId = req.params.id;
  const userId = req.user.id;
  const { description, amount, category, notes, date } = req.body;

  if (!description || !amount || !category || !date) {
    return res.status(400).json({ message: "Please fill all required fields" });
  }

  const updatedData = {
    description,
    amount,
    category,
    notes: notes || null,
    date,
  };

  Transaction.updateTransactionById(
    transactionId,
    userId,
    updatedData,
    (err, result) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Transaction not found or user not authorized" });
      }
      res.status(200).json({ message: "Transaction updated successfully" });
    }
  );
};

const deleteTransaction = (req, res) => {
  const transactionId = req.params.id;
  const userId = req.user.id;

  Transaction.deleteTransactionById(transactionId, userId, (err, result) => {
    if (err)
      return res.status(500).json({ message: "Database error", error: err });
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Transaction not found or user not authorized" });
    }
    res.status(200).json({ message: "Transaction deleted successfully" });
  });
};

module.exports = {
  addTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
};
const db = require("../config/db");

const findDuplicateTransaction = (data, callback) => {
  const sql = `
    SELECT id FROM transactions
    WHERE user_id = ? AND type = ? AND description = ? AND amount = ? AND category = ? AND date = ? AND (notes = ? OR (notes IS NULL AND ? IS NULL))
    LIMIT 1
  `;
  const params = [
    data.user_id,
    data.type,
    data.description,
    data.amount,
    data.category,
    data.date,
    data.notes,
    data.notes,
  ];
  db.query(sql, params, callback);
};

const createTransaction = (data, callback) => {
  findDuplicateTransaction(data, (err, results) => {
    if (err) return callback(err);

    if (results.length > 0) {
      const duplicateError = new Error("Duplicate transaction");
      duplicateError.code = "DUPLICATE_TRANSACTION";
      return callback(duplicateError);
    }

    const sql = `
      INSERT INTO transactions (user_id, type, description, amount, category, notes, date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      data.user_id,
      data.type,
      data.description,
      data.amount,
      data.category,
      data.notes,
      data.date,
    ];
    db.query(sql, params, callback);
  });
};

const getTransactionsByUserId = (userId, type, callback) => {
  let sql = "SELECT * FROM transactions WHERE user_id = ?";
  const params = [userId];

  if (type) {
    sql += " AND type = ?";
    params.push(type);
  }

  sql += " ORDER BY date DESC";
  db.query(sql, params, callback);
};

const getTransactionById = (transactionId, userId, callback) => {
  const sql = "SELECT * FROM transactions WHERE id = ? AND user_id = ?";
  db.query(sql, [transactionId, userId], callback);
};

const updateTransactionById = (transactionId, userId, data, callback) => {
  const sql = `
    UPDATE transactions
    SET description = ?, amount = ?, category = ?, notes = ?, date = ?
    WHERE id = ? AND user_id = ?
  `;
  const params = [
    data.description,
    data.amount,
    data.category,
    data.notes,
    data.date,
    transactionId,
    userId,
  ];
  db.query(sql, params, callback);
};

const deleteTransactionById = (transactionId, userId, callback) => {
  const sql = "DELETE FROM transactions WHERE id = ? AND user_id = ?";
  db.query(sql, [transactionId, userId], callback);
};

module.exports = {
  createTransaction,
  getTransactionsByUserId,
  getTransactionById,
  updateTransactionById,
  deleteTransactionById,
};
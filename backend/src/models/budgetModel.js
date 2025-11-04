const db = require("../config/db");

const createBudget = (data, callback) => {
  const sql =
    "INSERT INTO budgets (user_id, category, amount, month, description) VALUES (?, ?, ?, ?, ?)";
  const params = [
    data.user_id,
    data.category,
    data.amount,
    data.month,
    data.description,
  ];
  db.query(sql, params, callback);
};

const getBudgetsByMonth = (userId, month, callback) => {
  const sql = `
        SELECT 
            b.id, b.category, b.amount, b.description, b.month,
            COALESCE(SUM(t.amount), 0) as spent
        FROM 
            budgets b
        LEFT JOIN 
            transactions t ON b.user_id = t.user_id AND b.category = t.category AND DATE_FORMAT(t.date, '%Y-%m') = b.month AND t.type = 'expense'
        WHERE 
            b.user_id = ? AND b.month = ?
        GROUP BY
            b.id, b.category, b.amount, b.description, b.month
        ORDER BY
            b.category;
    `;
  db.query(sql, [userId, month], callback);
};

const getAllBudgets = (userId, callback) => {
  const sql = `
        SELECT 
            b.id, b.category, b.amount, b.description, b.month,
            COALESCE(SUM(t.amount), 0) as spent
        FROM 
            budgets b
        LEFT JOIN 
            transactions t ON b.user_id = t.user_id AND b.category = t.category AND DATE_FORMAT(t.date, '%Y-%m') = b.month AND t.type = 'expense'
        WHERE 
            b.user_id = ?
        GROUP BY
            b.id, b.category, b.amount, b.description, b.month
        ORDER BY
            b.category;
    `;
  db.query(sql, [userId], callback);
};

const getBudgetById = (budgetId, userId, callback) => {
  const sql = `
        SELECT 
            b.id, b.category, b.amount, b.description, b.month,
            COALESCE(SUM(t.amount), 0) as spent
        FROM 
            budgets b
        LEFT JOIN 
            transactions t ON b.user_id = t.user_id AND b.category = t.category AND DATE_FORMAT(t.date, '%Y-%m') = b.month AND t.type = 'expense'
        WHERE 
            b.id = ? AND b.user_id = ?
        GROUP BY
            b.id, b.category, b.amount, b.description, b.month
        LIMIT 1;
    `;
  db.query(sql, [budgetId, userId], callback);
};

const updateBudgetById = (budgetId, userId, data, callback) => {
  const sql =
    "UPDATE budgets SET category = ?, amount = ?, description = ? WHERE id = ? AND user_id = ?";
  const params = [
    data.category,
    data.amount,
    data.description,
    budgetId,
    userId,
  ];
  db.query(sql, params, callback);
};

const deleteBudgetById = (budgetId, userId, callback) => {
  const sql = "DELETE FROM budgets WHERE id = ? AND user_id = ?";
  db.query(sql, [budgetId, userId], callback);
};

module.exports = {
  createBudget,
  getBudgetsByMonth,
  getAllBudgets,
  getBudgetById,
  updateBudgetById,
  deleteBudgetById,
};
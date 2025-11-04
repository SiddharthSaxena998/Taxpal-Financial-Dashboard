const db = require("../config/db");

const getMonthlyTotals = (userId, callback) => {
  const sql = `
        SELECT
            type,
            SUM(amount) as total
        FROM
            transactions
        WHERE
            user_id = ? AND
            MONTH(date) = MONTH(CURDATE()) AND
            YEAR(date) = YEAR(CURDATE())
        GROUP BY
            type;
    `;
  db.query(sql, [userId], callback);
};

const getExpenseBreakdown = (userId, callback) => {
  const sql = `
        SELECT
            category,
            SUM(amount) as totalAmount
        FROM
            transactions
        WHERE
            user_id = ? AND
            type = 'expense' AND
            MONTH(date) = MONTH(CURDATE()) AND
            YEAR(date) = YEAR(CURDATE())
        GROUP BY
            category
        ORDER BY
            totalAmount DESC
        LIMIT 5;
    `;
  db.query(sql, [userId], callback);
};

const getMonthlySummaries = (userId, callback) => {
  const sql = `
        SELECT
            DATE_FORMAT(date, '%Y-%m') as month,
            type,
            SUM(amount) as total
        FROM
            transactions
        WHERE
            user_id = ? AND
            date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
        GROUP BY
            month, type
        ORDER BY
            month;
    `;
  db.query(sql, [userId], callback);
};

const getRecentTransactions = (userId, callback) => {
  const sql =
    "SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC, id DESC LIMIT 5";
  db.query(sql, [userId], callback);
};

module.exports = {
  getMonthlyTotals,
  getExpenseBreakdown,
  getMonthlySummaries,
  getRecentTransactions,
};
const db = require("../config/db");

const getTransactionsByPeriod = (userId, startDate, endDate, callback) => {
  const sql =
    "SELECT type, category, SUM(amount) as total FROM transactions WHERE user_id = ? AND date BETWEEN ? AND ? GROUP BY type, category";
  db.query(sql, [userId, startDate, endDate], callback);
};

const saveReport = (data, callback) => {
  const sql =
    "INSERT INTO reports (user_id, report_type, period, file_path) VALUES (?, ?, ?, ?)";
  db.query(
    sql,
    [data.user_id, data.report_type, data.period, data.file_path],
    callback
  );
};

const getReportsByUser = (userId, callback) => {
  const sql =
    "SELECT * FROM reports WHERE user_id = ? ORDER BY generated_at DESC";
  db.query(sql, [userId], callback);
};

module.exports = {
  getTransactionsByPeriod,
  saveReport,
  getReportsByUser,
};
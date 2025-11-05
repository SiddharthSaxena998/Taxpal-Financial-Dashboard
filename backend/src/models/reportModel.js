const db = require("../config/db");

const getTransactionsByPeriod = async (userId, startDate, endDate) => {
  const sql =
    "SELECT type, category, SUM(amount) as total FROM transactions WHERE user_id = ? AND date BETWEEN ? AND ? GROUP BY type, category";
  return new Promise((resolve, reject) => {
    db.query(sql, [userId, startDate, endDate], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const saveReport = async (data) => {
  const sql =
    "INSERT INTO reports (user_id, report_type, period, file_path) VALUES (?, ?, ?, ?)";
  return new Promise((resolve, reject) => {
    db.query(
      sql,
      [data.user_id, data.report_type, data.period, data.file_path],
      (err, result) => {
        if (err) return reject(err);
        resolve({ id: result.insertId, ...data });
      }
    );
  });
};

const getReportsByUser = async (userId) => {
  const sql = "SELECT * FROM reports WHERE user_id = ? ORDER BY id DESC";
  return new Promise((resolve, reject) => {
    db.query(sql, [userId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const getReportById = async (reportId, userId) => {
  const sql = "SELECT * FROM reports WHERE id = ? AND user_id = ?";
  return new Promise((resolve, reject) => {
    db.query(sql, [reportId, userId], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0)
        return reject(new Error("Report not found or access denied."));
      resolve(results[0]);
    });
  });
};

const deleteReport = async (reportId, userId) => {
  const sql = "DELETE FROM reports WHERE id = ? AND user_id = ?";
  return new Promise((resolve, reject) => {
    db.query(sql, [reportId, userId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

module.exports = {
  getTransactionsByPeriod,
  saveReport,
  getReportsByUser,
  getReportById,
  deleteReport,
};
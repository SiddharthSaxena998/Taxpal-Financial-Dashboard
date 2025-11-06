const db = require("../config/db");

const updateProfile = (userId, data) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE users 
      SET username = ?, fullname = ?, email = ?, phone = ?, company = ? 
      WHERE id = ?
    `;
    const params = [
      data.username,
      data.name,
      data.email,
      data.phone,
      data.company,
      userId,
    ];

    db.query(sql, params, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const updateNotifications = (userId, data) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE users 
      SET emailNotifications = ?, budgetAlerts = ?, taxReminders = ?, monthlyReports = ? 
      WHERE id = ?
    `;
    const params = [
      data.emailNotifications,
      data.budgetAlerts,
      data.taxReminders,
      data.monthlyReports,
      userId,
    ];

    db.query(sql, params, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const getUserById = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE id = ?";
    db.query(sql, [userId], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return reject(new Error("User not found"));
      resolve(results[0]);
    });
  });
};

const updatePassword = (userId, newPasswordHash) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE users SET password = ? WHERE id = ?";
    db.query(sql, [newPasswordHash, userId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const findUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], (err, results) => {
      if (err) return reject(err);
      resolve(results[0] || null);
    });
  });
};

module.exports = {
  updateProfile,
  updateNotifications,
  getUserById,
  updatePassword,
  findUserByUsername,
};
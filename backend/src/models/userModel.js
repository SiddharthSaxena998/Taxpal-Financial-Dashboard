const db = require("../config/db");

const createUser = (data, callback) => {
  const sql = `
    INSERT INTO users (username, password, fullname, email, country, income_bracket)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, data, callback);
};

const findUserByUsername = (username, callback) => {
  db.query("SELECT * FROM users WHERE username = ?", [username], callback);
};

module.exports = {
  createUser,
  findUserByUsername,
};
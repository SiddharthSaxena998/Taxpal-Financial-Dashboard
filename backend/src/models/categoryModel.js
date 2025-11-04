const db = require("../config/db");

const createCategory = (data, callback) => {
  const sql = "INSERT INTO categories (user_id, name, type) VALUES (?, ?, ?)";
  db.query(sql, [data.user_id, data.name, data.type], callback);
};

const getCategoriesByUser = (userId, callback) => {
  const sql = "SELECT * FROM categories WHERE user_id = ? ORDER BY type, name";
  db.query(sql, [userId], callback);
};

const updateCategoryById = (categoryId, userId, data, callback) => {
  const sql = "UPDATE categories SET name = ? WHERE id = ? AND user_id = ?";
  db.query(sql, [data.name, categoryId, userId], callback);
};

const deleteCategoryById = (categoryId, userId, callback) => {
  const sql = "DELETE FROM categories WHERE id = ? AND user_id = ?";
  db.query(sql, [categoryId, userId], callback);
};

const getCategorySuggestions = (userId, callback) => {
  const sql = `
        SELECT category AS name, type, COUNT(*) AS usage_count
        FROM transactions
        WHERE user_id = ? AND category IS NOT NULL AND category != ''
        GROUP BY category, type
        ORDER BY usage_count DESC
        LIMIT 10;
    `;
  db.query(sql, [userId], callback);
};

module.exports = {
  createCategory,
  getCategoriesByUser,
  updateCategoryById,
  deleteCategoryById,
  getCategorySuggestions,
};
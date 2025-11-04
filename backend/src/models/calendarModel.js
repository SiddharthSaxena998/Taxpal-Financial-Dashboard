const db = require("../config/db");

const createEvent = (data, callback) => {
  const sql =
    "INSERT INTO calendar_events (user_id, date, title, description, type) VALUES (?, ?, ?, ?, ?)";
  db.query(
    sql,
    [data.user_id, data.date, data.title, data.description, data.type],
    callback
  );
};

const getEventsByUser = (userId, callback) => {
  const sql = "SELECT * FROM calendar_events WHERE user_id = ? ORDER BY date";
  db.query(sql, [userId], callback);
};

const updateEventById = (eventId, userId, data, callback) => {
  const sql =
    "UPDATE calendar_events SET date = ?, title = ?, description = ?, type = ? WHERE id = ? AND user_id = ?";
  db.query(
    sql,
    [data.date, data.title, data.description, data.type, eventId, userId],
    callback
  );
};

const deleteEventById = (eventId, userId, callback) => {
  const sql = "DELETE FROM calendar_events WHERE id = ? AND user_id = ?";
  db.query(sql, [eventId, userId], callback);
};

module.exports = {
  createEvent,
  getEventsByUser,
  updateEventById,
  deleteEventById,
};
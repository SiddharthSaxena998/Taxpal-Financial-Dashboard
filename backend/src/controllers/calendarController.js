const Calendar = require("../models/calendarModel");

const getCalendarEvents = (req, res) => {
  const user_id = req.user.id;

  const staticTaxEvents = [
    {
      id: "static-reminder-q2",
      date: "2025-06-01",
      title: "Tax Reminder: Quarter 2 Payment Due Soon",
      description:
        "Reminder for upcoming Quarter 2 (Apr-Jun) estimated tax payment due on Jun 15, 2025",
      type: "reminder",
      isStatic: true,
    },
    {
      id: "static-payment-q2",
      date: "2025-06-15",
      title: "Quarter 2 Estimated Tax Payment Due",
      description: "Second quarter (Apr-Jun) estimated tax payment due date",
      type: "payment",
      isStatic: true,
    },
    {
      id: "static-reminder-q3",
      date: "2025-09-01",
      title: "Tax Reminder: Quarter 3 Payment Due Soon",
      description:
        "Reminder for upcoming Quarter 3 (Jul-Sep) estimated tax payment due on Sep 15, 2025",
      type: "reminder",
      isStatic: true,
    },
    {
      id: "static-payment-q3",
      date: "2025-09-15",
      title: "Quarter 3 Estimated Tax Payment Due",
      description: "Third quarter (Jul-Sep) estimated tax payment due date",
      type: "payment",
      isStatic: true,
    },
  ];

  Calendar.getEventsByUser(user_id, (err, customEvents) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Database error fetching custom events", error: err });
    }
    const allEvents = [...staticTaxEvents, ...customEvents];
    allEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    res.status(200).json(allEvents);
  });
};

const addCalendarEvent = (req, res) => {
  const { date, title, description, type } = req.body;
  const user_id = req.user.id;

  if (!date || !title) {
    return res.status(400).json({ message: "Date and title are required." });
  }

  const newEvent = {
    user_id,
    date,
    title,
    description,
    type: type || "custom",
  };
  Calendar.createEvent(newEvent, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Database error adding event", error: err });
    }
    res
      .status(201)
      .json({ message: "Event added successfully!", eventId: result.insertId });
  });
};

const updateCalendarEvent = (req, res) => {
  const eventId = req.params.id;
  const user_id = req.user.id;
  const { date, title, description, type } = req.body;

  if (!date || !title) {
    return res.status(400).json({ message: "Date and title are required." });
  }

  if (isNaN(eventId)) {
    return res
      .status(400)
      .json({ message: "Cannot update static tax events." });
  }

  const updatedEvent = { date, title, description, type: type || "custom" };
  Calendar.updateEventById(eventId, user_id, updatedEvent, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Database error updating event", error: err });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Event not found or user not authorized." });
    }
    res.status(200).json({ message: "Event updated successfully." });
  });
};

const deleteCalendarEvent = (req, res) => {
  const eventId = req.params.id;
  const user_id = req.user.id;

  if (isNaN(eventId)) {
    return res
      .status(400)
      .json({ message: "Cannot delete static tax events." });
  }

  Calendar.deleteEventById(eventId, user_id, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Database error deleting event", error: err });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Event not found or user not authorized." });
    }
    res.status(200).json({ message: "Event deleted successfully." });
  });
};

module.exports = {
  getCalendarEvents,
  addCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
};
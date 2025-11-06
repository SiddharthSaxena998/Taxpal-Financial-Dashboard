const UserSettings = require("../models/userSettingsModel");
const bcrypt = require("bcryptjs");

const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { username, name, email, phone, company } = req.body;

  if (!username || !name || !email) {
    return res
      .status(400)
      .json({ message: "Username, Name and Email are required" });
  }

  try {
    const existingUser = await UserSettings.findUserByUsername(username);
    if (existingUser && existingUser.id !== userId) {
      return res.status(400).json({ message: "Username already taken" });
    }

    await UserSettings.updateProfile(userId, {
      username,
      name,
      email,
      phone,
      company,
    });

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({
      message: "Server error updating profile",
      error: err.message,
    });
  }
};

const updateNotifications = async (req, res) => {
  const userId = req.user.id;
  const { emailNotifications, budgetAlerts, taxReminders, monthlyReports } =
    req.body;

  const data = {
    emailNotifications: emailNotifications ? 1 : 0,
    budgetAlerts: budgetAlerts ? 1 : 0,
    taxReminders: taxReminders ? 1 : 0,
    monthlyReports: monthlyReports ? 1 : 0,
  };

  try {
    await UserSettings.updateNotifications(userId, data);
    res.status(200).json({ message: "Notification preferences updated" });
  } catch (err) {
    console.error("Error updating notifications:", err);
    res.status(500).json({
      message: "Server error updating notifications",
      error: err.message,
    });
  }
};

const changePassword = async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await UserSettings.getUserById(userId);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect current password" });
    }

    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    await UserSettings.updatePassword(userId, newPasswordHash);

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).json({
      message: "Server error changing password",
      error: err.message,
    });
  }
};

module.exports = {
  updateProfile,
  updateNotifications,
  changePassword,
};
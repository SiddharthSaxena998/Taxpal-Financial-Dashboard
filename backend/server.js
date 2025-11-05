require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const authRoutes = require("./src/routes/auth");
const transactionRoutes = require("./src/routes/transactions");
const dashboardRoutes = require("./src/routes/dashboard");
const budgetRoutes = require("./src/routes/budgets");
const categoryRoutes = require("./src/routes/categories");
const taxRoutes = require("./src/routes/tax");
const calendarRoutes = require("./src/routes/calendar");
const reportRoutes = require("./src/routes/reports");

require("./src/config/db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/tax", taxRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/reports", reportRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
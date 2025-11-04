const Report = require("../models/reportModel");
const moment = require("moment");
const generateReport = (req, res) => {
  const { reportType, period } = req.body;
  const user_id = req.user.id;

  if (!reportType || !period) {
    return res
      .status(400)
      .json({ message: "Report type and period are required." });
  }

  let startDate, endDate;
  const today = moment();

  if (period === "Current Month") {
    startDate = today.clone().startOf("month").format("YYYY-MM-DD");
    endDate = today.clone().endOf("month").format("YYYY-MM-DD");
  } else if (period === "Last Month") {
    startDate = today
      .clone()
      .subtract(1, "month")
      .startOf("month")
      .format("YYYY-MM-DD");
    endDate = today
      .clone()
      .subtract(1, "month")
      .endOf("month")
      .format("YYYY-MM-DD");
  } else {
    return res.status(400).json({ message: "Invalid period specified." });
  }

  Report.getTransactionsByPeriod(
    user_id,
    startDate,
    endDate,
    (err, transactions) => {
      if (err) {
        return res
          .status(500)
          .json({
            message: "Database error fetching transactions.",
            error: err,
          });
      }

      let totalIncome = 0;
      let totalExpense = 0;
      const incomeBreakdown = {};
      const expenseBreakdown = {};

      transactions.forEach((t) => {
        if (t.type === "income") {
          totalIncome += parseFloat(t.total);
          incomeBreakdown[t.category] = parseFloat(t.total);
        } else if (t.type === "expense") {
          totalExpense += parseFloat(t.total);
          expenseBreakdown[t.category] = parseFloat(t.total);
        }
      });

      const netIncome = totalIncome - totalExpense;

      const reportData = {
        reportType: "Income Statement",
        period: period,
        generatedDate: moment().format("YYYY-MM-DD"),
        summary: {
          totalIncome: totalIncome.toFixed(2),
          totalExpense: totalExpense.toFixed(2),
          netIncome: netIncome.toFixed(2),
        },
        incomeBreakdown,
        expenseBreakdown,
      };

      const reportRecord = {
        user_id,
        report_type: reportType,
        period,
        file_path: `report-${Date.now()}.json`,
      };

      Report.saveReport(reportRecord, (err, result) => {
        if (err) {
          console.error("Could not save report record:", err);
        }
        res.status(200).json(reportData);
      });
    }
  );
};

const getReportHistory = (req, res) => {
  const user_id = req.user.id;
  Report.getReportsByUser(user_id, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({
          message: "Database error fetching report history.",
          error: err,
        });
    }
    res.status(200).json(results);
  });
};

module.exports = {
  generateReport,
  getReportHistory,
};
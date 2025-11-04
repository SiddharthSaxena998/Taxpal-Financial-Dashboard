const Dashboard = require("../models/dashboardModel");
const async = require("async");

const getDashboardStats = (req, res) => {
  const userId = req.user.id;

  async.parallel(
    {
      monthlyTotals: (callback) => Dashboard.getMonthlyTotals(userId, callback),
      expenseBreakdown: (callback) =>
        Dashboard.getExpenseBreakdown(userId, callback),
      monthlySummaries: (callback) =>
        Dashboard.getMonthlySummaries(userId, callback),
      recentTransactions: (callback) =>
        Dashboard.getRecentTransactions(userId, callback),
    },
    (err, results) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: "Error fetching dashboard data", error: err });
      }

      const monthlyTotalsData = results.monthlyTotals[0];
      const expenseBreakdownData = results.expenseBreakdown[0];
      const monthlySummariesData = results.monthlySummaries[0];
      const recentTransactionsData = results.recentTransactions[0];

      let monthlyIncome = 0;
      let monthlyExpense = 0;
      monthlyTotalsData.forEach((row) => {
        if (row.type === "income") {
          monthlyIncome = row.total;
        } else if (row.type === "expense") {
          monthlyExpense = row.total;
        }
      });

      const response = {
        summaryCards: {
          monthlyIncome: monthlyIncome,
          monthlyExpense: monthlyExpense,
          estimatedTax: 0,
          savingsRate:
            monthlyIncome > 0
              ? ((monthlyIncome - monthlyExpense) / monthlyIncome) * 100
              : 0,
        },
        expenseBreakdown: expenseBreakdownData,
        incomeVsExpenseChart: monthlySummariesData,
        recentTransactions: recentTransactionsData,
      };

      res.status(200).json(response);
    }
  );
};

module.exports = {
  getDashboardStats,
};
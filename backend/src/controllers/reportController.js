const Report = require("../models/reportModel");
const moment = require("moment");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const csv = require("fast-csv");

const generateFile = (format, filePath, data) => {
  return new Promise((resolve, reject) => {
    try {
      if (format === "pdf") {
        const doc = new PDFDocument({ margin: 50 });
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        doc
          .fontSize(20)
          .text(`${data.reportType} - ${data.period}`, { align: "center" });
        doc.moveDown();
        doc.fontSize(14).text(`Generated: ${data.generatedDate}`);
        doc.moveDown(2);

        doc.fontSize(16).text("Summary", { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(12).text(`Total Income: ${data.summary.totalIncome}`);
        doc.text(`Total Expense: ${data.summary.totalExpense}`);
        doc.moveDown(0.5);
        doc
          .fontSize(14)
          .font("Helvetica-Bold")
          .text(`Net Income: ${data.summary.netIncome}`);
        doc.moveDown(2);

        doc.font("Helvetica");
        doc.fontSize(16).text("Income Breakdown", { underline: true });
        doc.moveDown(0.5);
        for (const [key, value] of Object.entries(data.incomeBreakdown)) {
          doc.fontSize(12).text(`- ${key}: ${value}`);
        }
        doc.moveDown(2);

        doc.fontSize(16).text("Expense Breakdown", { underline: true });
        doc.moveDown(0.5);
        for (const [key, value] of Object.entries(data.expenseBreakdown)) {
          doc.fontSize(12).text(`- ${key}: ${value}`);
        }

        doc.end();
        stream.on("finish", resolve);
        stream.on("error", reject);
      } else if (format === "csv") {
        const ws = fs.createWriteStream(filePath);
        const csvData = [
          ["Report Type", data.reportType],
          ["Period", data.period],
          ["Generated Date", data.generatedDate],
          [],
          ["Summary", ""],
          ["Total Income", data.summary.totalIncome],
          ["Total Expense", data.summary.totalExpense],
          ["Net Income", data.summary.netIncome],
          [],
          ["Income Breakdown", "Amount"],
          ...Object.entries(data.incomeBreakdown),
          [],
          ["Expense Breakdown", "Amount"],
          ...Object.entries(data.expenseBreakdown),
        ];

        csv.write(csvData, { headers: false }).pipe(ws);
        ws.on("finish", resolve);
        ws.on("error", reject);
      }
    } catch (err) {
      reject(err);
    }
  });
};

const generateReport = async (req, res) => {
  const { reportType, period, format } = req.body;
  const user_id = req.user.id;

  if (!reportType || !period || !format) {
    return res
      .status(400)
      .json({ message: "Report type, period, and format are required." });
  }

  if (format !== "pdf" && format !== "csv") {
    return res
      .status(400)
      .json({ message: "Invalid format. Must be pdf or csv." });
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

  try {
    const transactions = await Report.getTransactionsByPeriod(
      user_id,
      startDate,
      endDate
    );

    let totalIncome = 0;
    let totalExpense = 0;
    const incomeBreakdown = {};
    const expenseBreakdown = {};

    transactions.forEach((t) => {
      if (t.type === "income") {
        totalIncome += parseFloat(t.total);
        incomeBreakdown[t.category] =
          (incomeBreakdown[t.category] || 0) + parseFloat(t.total);
      } else if (t.type === "expense") {
        totalExpense += parseFloat(t.total);
        expenseBreakdown[t.category] =
          (expenseBreakdown[t.category] || 0) + parseFloat(t.total);
      }
    });

    const netIncome = totalIncome - totalExpense;

    const reportData = {
      reportType: reportType,
      period,
      generatedDate: moment().format("YYYY-MM-DD"),
      summary: {
        totalIncome: totalIncome.toFixed(2),
        totalExpense: totalExpense.toFixed(2),
        netIncome: netIncome.toFixed(2),
      },
      incomeBreakdown,
      expenseBreakdown,
    };

    const uploadDir = path.join(__dirname, "..", "uploads", "reports");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const filename = `report-${user_id}-${Date.now()}.${format}`;
    const relativeFilePath = path.join("uploads", "reports", filename);
    const filePath = path.join(__dirname, "..", relativeFilePath);

    await generateFile(format, filePath, reportData);

    const reportRecord = {
      user_id,
      report_type: reportType,
      period,
      file_path: relativeFilePath,
    };

    const savedReport = await Report.saveReport(reportRecord);

    res.status(201).json({
      message: "Report generated successfully!",
      reportRecord: savedReport,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error generating report.",
      error: err.message,
    });
  }
};

const getReportHistory = async (req, res) => {
  const user_id = req.user.id;
  try {
    const results = await Report.getReportsByUser(user_id);
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({
      message: "Database error fetching report history.",
      error: err.message,
    });
  }
};

const downloadReport = async (req, res) => {
  try {
    const user_id = req.user.id;
    const reportId = req.params.reportId;

    const report = await Report.getReportById(reportId, user_id);

    if (!report) {
      return res
        .status(404)
        .json({ message: "Report not found or access denied." });
    }

    const absolutePath = path.join(__dirname, "..", report.file_path);

    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ message: "File not found on server." });
    }

    res.download(absolutePath);
  } catch (err) {
    res.status(500).json({
      message: "Server error or report not found.",
      error: err.message,
    });
  }
};

const deleteReport = async (req, res) => {
  try {
    const user_id = req.user.id;
    const reportId = req.params.reportId;

    const report = await Report.getReportById(reportId, user_id);

    if (!report) {
      return res
        .status(404)
        .json({ message: "Report not found or access denied." });
    }

    const absolutePath = path.join(__dirname, "..", report.file_path);
    if (fs.existsSync(absolutePath)) fs.unlinkSync(absolutePath);

    await Report.deleteReport(reportId, user_id);

    res.status(200).json({ message: "Report deleted successfully." });
  } catch (err) {
    res.status(500).json({
      message: "Server error deleting report.",
      error: err.message,
    });
  }
};

module.exports = {
  generateReport,
  getReportHistory,
  downloadReport,
  deleteReport,
};
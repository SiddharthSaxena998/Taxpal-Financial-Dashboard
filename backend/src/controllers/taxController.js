const db = require("../config/db");
const taxService = require("../services/taxService");

const calculateTax = (req, res) => {
  const {
    grossIncome,
    businessExpenses = 0,
    retirementContributions = 0,
    healthInsurancePremiums = 0,
    homeOfficeDeduction = 0,
    quarter,
    country,
    stateProvince = "",
    filingStatus = "single",
  } = req.body;

  const user_id = req.user.id;

  const income = parseFloat(grossIncome);
  const expenses = parseFloat(businessExpenses);
  const retirement = parseFloat(retirementContributions);
  const health = parseFloat(healthInsurancePremiums);
  const homeOffice = parseFloat(homeOfficeDeduction);

  if (
    isNaN(income) ||
    isNaN(expenses) ||
    isNaN(retirement) ||
    isNaN(health) ||
    isNaN(homeOffice) ||
    !quarter ||
    !country
  ) {
    return res.status(400).json({
      message:
        "Valid gross income, deductions, quarter, and country are required.",
    });
  }

  if (
    income < 0 ||
    expenses < 0 ||
    retirement < 0 ||
    health < 0 ||
    homeOffice < 0
  ) {
    return res
      .status(400)
      .json({ message: "Income and deductions cannot be negative." });
  }

  const totalDeductions = expenses + retirement + health + homeOffice;

  const quarterlyTaxableIncome = Math.max(0, income - totalDeductions);
  const estimatedAnnualTaxableIncome = quarterlyTaxableIncome * 4;

  const estimatedAnnualTax = taxService.calculateTaxForCountry(
    country,
    estimatedAnnualTaxableIncome,
    filingStatus
  );
  const estimatedQuarterlyTax = Math.max(0, estimatedAnnualTax / 4);

  const sql = `
        INSERT INTO tax_estimates
        (user_id, quarter, gross_income, business_expenses, retirement_contributions,
        health_insurance_premiums, home_office_deduction, total_deductions, estimated_tax, state_province)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
  const params = [
    user_id,
    quarter,
    income,
    expenses,
    retirement,
    health,
    homeOffice,
    totalDeductions,
    estimatedQuarterlyTax,
    stateProvince,
  ];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("Database error saving tax estimate:", err);
      return res
        .status(500)
        .json({ message: "Database error while saving tax estimate." });
    }

    res.status(200).json({
      quarterlyTaxableIncome: quarterlyTaxableIncome.toFixed(2),
      estimatedQuarterlyTax: estimatedQuarterlyTax.toFixed(2),
      countryUsed: country,
      stateProvinceUsed: stateProvince,
      filingStatusUsed: filingStatus,
      estimatedAnnualTaxableIncome: estimatedAnnualTaxableIncome.toFixed(2),
      estimatedAnnualTax: estimatedAnnualTax.toFixed(2),
    });
  });
};

const getTaxHistory = (req, res) => {
  const user_id = req.user.id;
  const sql =
    "SELECT * FROM tax_estimates WHERE user_id = ? ORDER BY calculation_date DESC";

  db.query(sql, [user_id], (err, results) => {
    if (err) {
      console.error("Database error fetching tax history:", err);
      return res
        .status(500)
        .json({ message: "Database error while fetching tax history." });
    }
    res.status(200).json(results);
  });
};

module.exports = {
  calculateTax,
  getTaxHistory,
};
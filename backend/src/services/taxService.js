const calculateSlabTax = (income, slabs) => {
  let tax = 0;
  let previousLimit = 0;
  for (const slab of slabs) {
    if (income <= previousLimit) break;
    const incomeInSlab = Math.min(income, slab.limit) - previousLimit;
    tax += incomeInSlab * slab.rate;
    previousLimit = slab.limit;
  }
  return tax;
};

// --- India ---
const indiaTaxSlabs_NewRegime = [
  { limit: 300000, rate: 0.0 },
  { limit: 600000, rate: 0.05 },
  { limit: 900000, rate: 0.1 },
  { limit: 1200000, rate: 0.15 },
  { limit: 1500000, rate: 0.2 },
  { limit: Infinity, rate: 0.3 },
];
const calculateIndiaTax = (annualTaxableIncome) => {
  let tax = calculateSlabTax(annualTaxableIncome, indiaTaxSlabs_NewRegime);
  if (annualTaxableIncome <= 700000) tax = 0;
  else tax *= 1.04;
  return tax;
};

// --- USA ---
const usaTaxSlabs_Single = [
  { limit: 11600, rate: 0.1 },
  { limit: 47150, rate: 0.12 },
  { limit: 100525, rate: 0.22 },
  { limit: 191950, rate: 0.24 },
  { limit: 243725, rate: 0.32 },
  { limit: 609350, rate: 0.35 },
  { limit: Infinity, rate: 0.37 },
];
const usaTaxSlabs_MFJ = [
  { limit: 23200, rate: 0.1 },
  { limit: 94300, rate: 0.12 },
  { limit: 201050, rate: 0.22 },
  { limit: 383900, rate: 0.24 },
  { limit: 487450, rate: 0.32 },
  { limit: 731200, rate: 0.35 },
  { limit: Infinity, rate: 0.37 },
];
const calculateUSATax = (annualTaxableIncome, filingStatus) => {
  const slabs =
    filingStatus && filingStatus.toLowerCase().includes("married")
      ? usaTaxSlabs_MFJ
      : usaTaxSlabs_Single;
  return calculateSlabTax(annualTaxableIncome, slabs);
};

// --- UK ---
const ukPersonalAllowance = 12570;
const ukTaxSlabs = [
  { limit: 37700, rate: 0.2 },
  { limit: 125140 - ukPersonalAllowance, rate: 0.4 },
  { limit: Infinity, rate: 0.45 },
];
const calculateUKTax = (annualGrossIncome) => {
  const taxableIncome = Math.max(0, annualGrossIncome - ukPersonalAllowance);
  return calculateSlabTax(taxableIncome, ukTaxSlabs);
};

// --- Canada ---
const canadaBPA = 15705;
const canadaTaxSlabs = [
  { limit: 55867, rate: 0.15 },
  { limit: 111733, rate: 0.205 },
  { limit: 173205, rate: 0.26 },
  { limit: 246752, rate: 0.29 },
  { limit: Infinity, rate: 0.33 },
];
const calculateCanadaTax = (annualGrossIncome) => {
  const taxableIncome = Math.max(0, annualGrossIncome - canadaBPA);
  return calculateSlabTax(taxableIncome, canadaTaxSlabs);
};

// --- Australia ---
const australiaTaxSlabs = [
  { limit: 18200, rate: 0.0 },
  { limit: 45000, rate: 0.19 },
  { limit: 120000, rate: 0.325 },
  { limit: 180000, rate: 0.37 },
  { limit: Infinity, rate: 0.45 },
];
const calculateAustraliaTax = (annualTaxableIncome) => {
  return calculateSlabTax(annualTaxableIncome, australiaTaxSlabs);
};

// --- Germany ---
const germanyBasicAllowance = 11604;
const germanyTaxSlabs = [
  { limit: 66760 - germanyBasicAllowance, rate: 0.14 },
  { limit: 277825 - germanyBasicAllowance, rate: 0.42 },
  { limit: Infinity, rate: 0.45 },
];
const calculateGermanyTax = (annualGrossIncome) => {
  const taxableIncome = Math.max(0, annualGrossIncome - germanyBasicAllowance);
  return calculateSlabTax(taxableIncome, germanyTaxSlabs);
};

// --- France ---
const franceTaxSlabs = [
  { limit: 11294, rate: 0.0 },
  { limit: 28797, rate: 0.11 },
  { limit: 82341, rate: 0.3 },
  { limit: 177106, rate: 0.41 },
  { limit: Infinity, rate: 0.45 },
];
const calculateFranceTax = (annualTaxableIncome) => {
  return calculateSlabTax(annualTaxableIncome, franceTaxSlabs);
};

// --- Japan ---
const japanTaxSlabs = [
  { limit: 1950000, rate: 0.05 },
  { limit: 3300000, rate: 0.1 },
  { limit: 6950000, rate: 0.2 },
  { limit: 9000000, rate: 0.23 },
  { limit: 18000000, rate: 0.33 },
  { limit: 40000000, rate: 0.4 },
  { limit: Infinity, rate: 0.45 },
];
const calculateJapanTax = (annualTaxableIncome) => {
  return calculateSlabTax(annualTaxableIncome, japanTaxSlabs);
};

const calculateTaxForCountry = (country, annualTaxableIncome, filingStatus) => {
  if (annualTaxableIncome <= 0) return 0;
  const countryLower = country.toLowerCase().trim();

  if (countryLower === "india") return calculateIndiaTax(annualTaxableIncome);
  if (countryLower === "usa" || countryLower === "united states")
    return calculateUSATax(annualTaxableIncome, filingStatus);
  if (countryLower === "uk" || countryLower === "united kingdom")
    return calculateUKTax(annualTaxableIncome);
  if (countryLower === "canada") return calculateCanadaTax(annualTaxableIncome);
  if (countryLower === "australia")
    return calculateAustraliaTax(annualTaxableIncome);
  if (countryLower === "germany")
    return calculateGermanyTax(annualTaxableIncome);
  if (countryLower === "france") return calculateFranceTax(annualTaxableIncome);
  if (countryLower === "japan") return calculateJapanTax(annualTaxableIncome);

  console.warn(
    `Tax logic for country "${country}" not implemented. Using default flat rate.`
  );
  return annualTaxableIncome * 0.15;
};

module.exports = {
  calculateTaxForCountry,
};
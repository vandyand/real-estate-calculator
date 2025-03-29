// DOM Ready Event
document.addEventListener("DOMContentLoaded", function () {
  // Tab Switching Functionality
  setupTabs();

  // Setup Calculator Event Listeners
  setupCalculators();

  // Setup Affiliate Link Tracking
  setupAffiliateTracking();

  // Setup Lead Form Capture
  setupLeadCapture();
});

// Tab Switching
function setupTabs() {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all tabs
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // Add active class to clicked tab
      button.classList.add("active");
      const tabId = `${button.dataset.tab}-tab`;
      document.getElementById(tabId).classList.add("active");
    });
  });
}

// Calculator Setup
function setupCalculators() {
  // Mortgage Calculator
  document
    .getElementById("mortgage-calculate")
    .addEventListener("click", calculateMortgage);

  // Cash Flow Calculator
  document
    .getElementById("cashflow-calculate")
    .addEventListener("click", calculateCashFlow);

  // ROI Calculator
  document
    .getElementById("roi-calculate")
    .addEventListener("click", calculateROI);

  // Rehab Calculator
  document
    .getElementById("rehab-calculate")
    .addEventListener("click", calculateRehab);
}

// Mortgage Calculator Function
function calculateMortgage() {
  // Get input values
  const propertyPrice = parseFloat(
    document.getElementById("property-price").value
  );
  const downPaymentPercent = parseFloat(
    document.getElementById("down-payment").value
  );
  const interestRate = parseFloat(
    document.getElementById("interest-rate").value
  );
  const loanTerm = parseFloat(document.getElementById("loan-term").value);

  // Calculate loan amount
  const downPaymentAmount = propertyPrice * (downPaymentPercent / 100);
  const loanAmount = propertyPrice - downPaymentAmount;

  // Calculate monthly payment
  const monthlyRate = interestRate / 100 / 12;
  const payments = loanTerm * 12;
  const x = Math.pow(1 + monthlyRate, payments);
  const monthlyPayment = (loanAmount * x * monthlyRate) / (x - 1);

  // Calculate total interest
  const totalPayment = monthlyPayment * payments;
  const totalInterest = totalPayment - loanAmount;

  // Display results
  document.getElementById("monthly-payment").textContent =
    formatCurrency(monthlyPayment);
  document.getElementById("total-interest").textContent =
    formatCurrency(totalInterest);
  document.getElementById("total-cost").textContent =
    formatCurrency(totalPayment);

  // Track calculation for analytics (if implemented)
  trackCalculation("mortgage", {
    propertyPrice,
    downPaymentPercent,
    interestRate,
    loanTerm,
    monthlyPayment,
    totalInterest,
  });
}

// Cash Flow Calculator Function
function calculateCashFlow() {
  // Get input values
  const monthlyRent = parseFloat(document.getElementById("monthly-rent").value);
  const vacancyRate = parseFloat(document.getElementById("vacancy-rate").value);
  const propertyTax = parseFloat(document.getElementById("property-tax").value);
  const insurance = parseFloat(document.getElementById("insurance").value);
  const maintenance = parseFloat(document.getElementById("maintenance").value);
  const capex = parseFloat(document.getElementById("capex").value);
  const management = parseFloat(document.getElementById("management").value);
  const utilities = parseFloat(document.getElementById("utilities").value);

  // Calculate effective monthly income (accounting for vacancy)
  const effectiveIncome = monthlyRent * (1 - vacancyRate / 100);

  // Calculate monthly expenses
  const monthlyPropertyTax = propertyTax / 12;
  const monthlyInsurance = insurance / 12;
  const monthlyMaintenance = monthlyRent * (maintenance / 100);
  const monthlyCapex = monthlyRent * (capex / 100);
  const monthlyManagement = monthlyRent * (management / 100);

  const totalMonthlyExpenses =
    monthlyPropertyTax +
    monthlyInsurance +
    monthlyMaintenance +
    monthlyCapex +
    monthlyManagement +
    utilities;

  // Calculate cash flow
  const monthlyCashFlow = effectiveIncome - totalMonthlyExpenses;
  const annualCashFlow = monthlyCashFlow * 12;

  // Display results
  document.getElementById("monthly-income").textContent =
    formatCurrency(effectiveIncome);
  document.getElementById("monthly-expenses").textContent =
    formatCurrency(totalMonthlyExpenses);
  document.getElementById("monthly-cashflow").textContent =
    formatCurrency(monthlyCashFlow);
  document.getElementById("annual-cashflow").textContent =
    formatCurrency(annualCashFlow);

  // Update Annual Cash Flow in ROI calculator for convenience
  if (document.getElementById("annual-cashflow-input")) {
    document.getElementById("annual-cashflow-input").value =
      Math.round(annualCashFlow);
  }

  // Track calculation for analytics (if implemented)
  trackCalculation("cashflow", {
    monthlyRent,
    vacancyRate,
    totalMonthlyExpenses,
    monthlyCashFlow,
    annualCashFlow,
  });
}

// ROI Calculator Function
function calculateROI() {
  // Get input values
  const purchasePrice = parseFloat(
    document.getElementById("purchase-price").value
  );
  const closingCosts = parseFloat(
    document.getElementById("closing-costs").value
  );
  const rehabBudget = parseFloat(document.getElementById("rehab-budget").value);
  const annualCashFlow = parseFloat(
    document.getElementById("annual-cashflow-input").value
  );
  const appreciationRate = parseFloat(
    document.getElementById("appreciation-rate").value
  );
  const investmentPeriod = parseFloat(
    document.getElementById("investment-period").value
  );

  // Calculate down payment (20% is standard for investment properties)
  const downPayment = purchasePrice * 0.2;

  // Calculate total investment
  const totalInvestment = downPayment + closingCosts + rehabBudget;

  // Calculate cash-on-cash return
  const cashOnCash = (annualCashFlow / totalInvestment) * 100;

  // Calculate property value after appreciation
  const futureValue =
    purchasePrice * Math.pow(1 + appreciationRate / 100, investmentPeriod);
  const equity = futureValue - purchasePrice * 0.8; // Assuming 80% LTV loan

  // Calculate total profit (cash flow + equity)
  const totalCashFlow = annualCashFlow * investmentPeriod;
  const totalProfit = totalCashFlow + equity - totalInvestment;

  // Calculate total ROI
  const totalROI = (totalProfit / totalInvestment) * 100;

  // Calculate annualized ROI
  const annualizedROI = Math.pow(1 + totalROI / 100, 1 / investmentPeriod) - 1;

  // Display results
  document.getElementById("total-investment").textContent =
    formatCurrency(totalInvestment);
  document.getElementById("cash-on-cash").textContent =
    formatPercentage(cashOnCash);
  document.getElementById("total-roi").textContent = formatPercentage(totalROI);
  document.getElementById("annualized-roi").textContent = formatPercentage(
    annualizedROI * 100
  );

  // Track calculation for analytics (if implemented)
  trackCalculation("roi", {
    purchasePrice,
    totalInvestment,
    cashOnCash,
    totalROI,
    annualizedROI,
  });
}

// Rehab Calculator Function
function calculateRehab() {
  // Get values from all rehab selects
  const roofCost = parseFloat(document.getElementById("roof").value);
  const sidingCost = parseFloat(document.getElementById("siding").value);
  const landscapingCost = parseFloat(
    document.getElementById("landscaping").value
  );
  const kitchenCost = parseFloat(document.getElementById("kitchen").value);
  const bathroomsCost = parseFloat(document.getElementById("bathrooms").value);
  const flooringCost = parseFloat(document.getElementById("flooring").value);
  const hvacCost = parseFloat(document.getElementById("hvac").value);
  const plumbingCost = parseFloat(document.getElementById("plumbing").value);
  const electricalCost = parseFloat(
    document.getElementById("electrical").value
  );

  // Calculate total rehab cost
  const totalRehabCost =
    roofCost +
    sidingCost +
    landscapingCost +
    kitchenCost +
    bathroomsCost +
    flooringCost +
    hvacCost +
    plumbingCost +
    electricalCost;

  // Display result
  document.getElementById("total-rehab-cost").textContent =
    formatCurrency(totalRehabCost);

  // Update Rehab Budget in ROI calculator for convenience
  if (document.getElementById("rehab-budget")) {
    document.getElementById("rehab-budget").value = Math.round(totalRehabCost);
  }

  // Track calculation for analytics (if implemented)
  trackCalculation("rehab", {
    totalRehabCost,
    roofCost,
    kitchenCost,
    bathroomsCost,
  });
}

// Affiliate Link Tracking
function setupAffiliateTracking() {
  // Mortgage affiliate link
  const mortgageAffiliateLink = document.getElementById("mortgage-affiliate");
  if (mortgageAffiliateLink) {
    mortgageAffiliateLink.addEventListener("click", function (e) {
      e.preventDefault();

      // Get mortgage details for better targeting
      const propertyPrice = document.getElementById("property-price").value;
      const downPayment = document.getElementById("down-payment").value;

      // In a real implementation, this would be:
      // window.location.href = `https://mortgage-affiliate.com/?price=${propertyPrice}&down=${downPayment}&ref=your_affiliate_id`;

      // For demo purposes, we'll just log it
      console.log("Mortgage affiliate link clicked", {
        propertyPrice,
        downPayment,
        timestamp: new Date().toISOString(),
      });

      // Tracking
      trackAffiliateLinkClick("mortgage", {
        propertyPrice,
        downPayment,
      });
    });
  }

  // Property manager affiliate link
  const propertyManagerLink = document.getElementById(
    "property-manager-affiliate"
  );
  if (propertyManagerLink) {
    propertyManagerLink.addEventListener("click", function (e) {
      e.preventDefault();

      // For demo purposes, we'll just log it
      console.log("Property manager affiliate link clicked", {
        timestamp: new Date().toISOString(),
      });

      // Tracking
      trackAffiliateLinkClick("property_manager");
    });
  }

  // Property search affiliate link
  const propertySearchLink = document.getElementById(
    "property-search-affiliate"
  );
  if (propertySearchLink) {
    propertySearchLink.addEventListener("click", function (e) {
      e.preventDefault();

      // For demo purposes, we'll just log it
      console.log("Property search affiliate link clicked", {
        timestamp: new Date().toISOString(),
      });

      // Tracking
      trackAffiliateLinkClick("property_search");
    });
  }

  // Contractor affiliate link
  const contractorLink = document.getElementById("contractor-affiliate");
  if (contractorLink) {
    contractorLink.addEventListener("click", function (e) {
      e.preventDefault();

      // Get rehab details for better targeting
      const totalRehabCost =
        document.getElementById("total-rehab-cost").textContent;

      // For demo purposes, we'll just log it
      console.log("Contractor affiliate link clicked", {
        totalRehabCost,
        timestamp: new Date().toISOString(),
      });

      // Tracking
      trackAffiliateLinkClick("contractor", { totalRehabCost });
    });
  }
}

// Lead Capture Form
function setupLeadCapture() {
  const leadForm = document.getElementById("lead-form");
  if (leadForm) {
    leadForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = this.querySelector('input[type="email"]').value;

      // In a real implementation, you'd send this to your server or email service
      // For demo purposes, we'll just log it
      console.log("Lead captured:", email, {
        timestamp: new Date().toISOString(),
      });

      // Show success message
      leadForm.innerHTML =
        '<p class="success">Thank you! Your report will be emailed shortly.</p>';

      // Track lead capture
      trackLeadCapture(email);
    });
  }
}

// Analytics Tracking Functions (would integrate with Google Analytics, etc. in production)
function trackCalculation(calculatorType, data) {
  console.log(`Calculator used: ${calculatorType}`, data);
  // In production: gtag('event', 'calculation', { calculatorType, ...data });
}

function trackAffiliateLinkClick(affiliateType, data = {}) {
  console.log(`Affiliate link clicked: ${affiliateType}`, data);
  // In production: gtag('event', 'affiliate_click', { affiliateType, ...data });
}

function trackLeadCapture(email) {
  console.log("Lead captured", { emailProvided: !!email });
  // In production: gtag('event', 'lead_capture', { emailProvided: !!email });
}

// Utility functions
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatPercentage(percent) {
  return percent.toFixed(1) + "%";
}

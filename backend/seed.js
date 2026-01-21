dotenv.config();
const dotenv = require("dotenv");
const pool = require("./config/db");

// Helper to insert a workflow and return its id
async function insertWorkflow({ title, description, type, category }) {
  const result = await pool.query(
    "INSERT INTO workflows (title, description, type, category) VALUES ($1, $2, $3, $4) RETURNING id",
    [title, description, type, category],
  );
  return result.rows[0].id;
}

// Helper to insert a step and return its id
async function insertStep({
  workflow_id,
  order,
  title,
  description,
  actionChecklist,
}) {
  const result = await pool.query(
    'INSERT INTO steps (workflow_id, "order", title, description, action_checklist) VALUES ($1, $2, $3, $4, $5) RETURNING id',
    [workflow_id, order, title, description, actionChecklist],
  );
  return result.rows[0].id;
}

async function seedData() {
  try {
    // Clear existing data
    await pool.query("DELETE FROM resources");
    await pool.query("DELETE FROM steps");
    await pool.query("DELETE FROM workflows");

    // === APPLY WORKFLOWS ===
    // 1. PAN Card
    const panWorkflowId = await insertWorkflow({
      title: "Apply for PAN Card",
      description:
        "Step-by-step guide to apply for a Permanent Account Number (PAN) in India.",
      type: "apply",
      category: "Government",
    });
    await createSteps(panWorkflowId, [
      {
        order: 1,
        title: "Visit Protean (NSDL) Website",
        description: "Go to the official Protean portal.",
        actionChecklist: [
          "Open https://www.protean-tinpan.com/services/pan/pan-index.html",
          'Select "Apply for PAN"',
          "Select Category: Individual",
        ],
      },
      {
        order: 2,
        title: "Fill Personal Details",
        description: "Enter details exactly as per Aadhaar.",
        actionChecklist: [
          "Enter Name & DOB",
          "Enter Email & Mobile",
          "Submit and save Token Number",
        ],
      },
      {
        order: 3,
        title: "Submit Documents",
        description: "Use Aadhaar e-KYC for paperless submission.",
        actionChecklist: [
          'Select "Submit digitally through e-KYC"',
          "Enter Aadhaar Number",
          "Authenticate via OTP",
        ],
      },
      {
        order: 4,
        title: "Payment & Submission",
        description: "Pay the fee (approx ₹101).",
        actionChecklist: ["Pay via UPI/Card", "Download Acknowledgement"],
      },
    ]);

    // 2. Aadhaar Card
    const aadhaarWorkflowId = await insertWorkflow({
      title: "Apply for Aadhaar Card",
      description:
        "Guide to enrolling for a new Aadhaar card or updating details.",
      type: "apply",
      category: "Government",
    });
    await createSteps(aadhaarWorkflowId, [
      {
        order: 1,
        title: "Locate Enrolment Center",
        description: "New Aadhaar enrolment requires a physical visit.",
        actionChecklist: [
          "Visit https://appointments.uidai.gov.in/easearch.aspx",
          "Find nearest center",
          "Book an appointment online (optional but recommended)",
        ],
      },
      {
        order: 2,
        title: "Gather Documents",
        description:
          "You need Proof of Identity (POI) and Proof of Address (POA).",
        actionChecklist: [
          "POI: Passport, PAN, Voter ID",
          "POA: Passport, Voter ID, Ration Card",
          "Proof of Birth: Birth Certificate",
        ],
      },
      {
        order: 3,
        title: "Visit Center",
        description: "Go to the center with your documents.",
        actionChecklist: [
          "Fill Enrolment Form",
          "Submit Biometrics (Iris, Fingerprints, Photo)",
          "Collect Acknowledgement Slip",
        ],
      },
      {
        order: 4,
        title: "Track Status",
        description: "It takes up to 90 days for generation.",
        actionChecklist: [
          "Visit https://myaadhaar.uidai.gov.in/CheckAadhaarStatus",
          "Enter Enrolment ID from slip",
        ],
      },
    ]);

    // 3. Driving License (DL)
    const dlWorkflowId = await insertWorkflow({
      title: "Apply for Driving License",
      description:
        "Process to get a Learner's License (LL) and then a Permanent DL.",
      type: "apply",
      category: "Government",
    });
    await createSteps(dlWorkflowId, [
      {
        order: 1,
        title: "Apply for Learner's License (LL)",
        description: "Visit Parivahan Sewa portal.",
        actionChecklist: [
          "Go to https://parivahan.gov.in/",
          "Select State",
          "Apply for Learner License",
          "Fill details & Upload documents",
        ],
      },
      {
        order: 2,
        title: "Take LL Test",
        description: "Online or offline test on traffic rules.",
        actionChecklist: [
          "Watch safety tutorial",
          "Take online test (if available in state)",
          "Download Learner License after passing",
        ],
      },
      {
        order: 3,
        title: "Apply for Permanent DL",
        description: "After 30 days of holding LL.",
        actionChecklist: [
          "Login to Parivahan again",
          "Apply for Driving License",
          "Book Driving Test Slot",
        ],
      },
      {
        order: 4,
        title: "Driving Test",
        description: "Visit RTO for the physical test.",
        actionChecklist: [
          "Take car/bike to RTO",
          "Pass the driving skill test",
          "DL will be posted to your address",
        ],
      },
    ]);

    // 4. Bank Account Opening
    const bankWorkflowId = await insertWorkflow({
      title: "Open Savings Account",
      description: "Open a digital zero-balance savings account online.",
      type: "apply",
      category: "Banking",
    });
    await createSteps(bankWorkflowId, [
      {
        order: 1,
        title: "Choose a Bank",
        description: "Compare interest rates and minimum balance requirements.",
        actionChecklist: [
          "Research heavyweights like SBI, HDFC, ICICI",
          'Look for "Digital Savings Account"',
        ],
      },
      {
        order: 2,
        title: "Start Online Application",
        description: "Visit bank website or download app.",
        actionChecklist: [
          'Click "Open Account"',
          "Enter Mobile Number linked to Aadhaar",
          "Verify OTP",
        ],
      },
      {
        order: 3,
        title: "Video KYC",
        description: "Complete KYC without visiting a branch.",
        actionChecklist: [
          "Keep PAN & Aadhaar ready",
          "Ensure good lighting",
          "Connect with agent via video call",
          "Show original PAN card",
        ],
      },
      {
        order: 4,
        title: "Account Activation",
        description: "Get account details instantly.",
        actionChecklist: [
          "Receive Account No. & IFSC",
          "Set up Net Banking/Mobile App",
          "Order Debit Card",
        ],
      },
    ]);

    // 5. Voter ID Card
    const voterWorkflowId = await insertWorkflow({
      title: "Apply for Voter ID Card",
      description: "Register as a new voter (Form 6) via the NVSP portal.",
      type: "apply",
      category: "Government",
    });
    await createSteps(voterWorkflowId, [
      {
        order: 1,
        title: "Visit NVSP Portal",
        description:
          "Go to https://voters.eci.gov.in/ (National Voters' Service Portal).",
        actionChecklist: [
          "Sign up/Login with Mobile",
          'Select "New Registration for General Electors" (Form 6)',
        ],
      },
      {
        order: 2,
        title: "Fill Form 6",
        description: "Enter personal details and upload photos.",
        actionChecklist: [
          "Upload Passport Size Photo",
          "Enter Name, Gender, DOB",
          "Enter Address details accurately",
        ],
      },
      {
        order: 3,
        title: "Upload Proofs",
        description: "Provide Age and Address proof.",
        actionChecklist: [
          "Age Proof: Birth Cert, Aadhaar, PAN",
          "Address Proof: Aadhaar, Passport, Ration Card",
        ],
      },
      {
        order: 4,
        title: "Submit & Track",
        description: "Note the Reference ID.",
        actionChecklist: [
          "Submit the form",
          "Use Reference ID to track status",
          "Card delivered by post in 30-45 days",
        ],
      },
    ]);

    // 6. Passport
    const passportWorkflowId = await insertWorkflow({
      title: "Apply for Passport",
      description: "Apply for a fresh Passport via Passport Seva Kendra (PSK).",
      type: "apply",
      category: "Government",
    });
    await createSteps(passportWorkflowId, [
      {
        order: 1,
        title: "Register on Passport Seva",
        description: "Visit https://www.passportindia.gov.in/",
        actionChecklist: [
          'Click "New User Registration"',
          "Create ID and Password",
          "Login to the portal",
        ],
      },
      {
        order: 2,
        title: "Fill Application Form",
        description: "Apply for Fresh Passport.",
        actionChecklist: [
          'Click "Apply for Fresh Passport"',
          "Fill details carefully (match Aadhaar)",
          "Submit form online",
        ],
      },
      {
        order: 3,
        title: "Pay & Schedule Appointment",
        description: "Booking a slot at PSK is mandatory.",
        actionChecklist: [
          'Click "Pay and Schedule Appointment"',
          "Select PSK location",
          "Pay fee (approx ₹1500)",
        ],
      },
      {
        order: 4,
        title: "Visit PSK",
        description: "Physical verification of documents.",
        actionChecklist: [
          "Print Application Receipt (ARN)",
          "Carry Original Documents",
          "Biometrics will be taken at PSK",
          "Police Verification follows",
        ],
      },
    ]);

    // === LEARN WORKFLOWS ===
    // 5. Banking Basics
    const bankingLearnId = await insertWorkflow({
      title: "Banking Basics",
      description: "Understand types of accounts, deposits, and safety.",
      type: "learn",
      category: "Personal Finance",
    });
    await createSteps(bankingLearnId, [
      {
        order: 1,
        title: "Savings vs Current Accounts",
        description:
          "Savings is for personal use with interest; Current is for business with no transaction limits.",
        actionChecklist: [
          "Check interest rates",
          "Understand minimum balance penalties",
        ],
      },
      {
        order: 2,
        title: "Fixed Deposits (FD)",
        description: "Safe investment with higher interest than savings.",
        actionChecklist: [
          "Compare FD rates (6-8%)",
          "Understand lock-in periods",
        ],
      },
      {
        order: 3,
        title: "Cheques & Demand Drafts",
        description: "Traditional payment methods explained.",
        actionChecklist: ["How to fill a cheque", "When to use a DD"],
      },
    ]);

    // 6. Income Tax
    const taxLearnId = await insertWorkflow({
      title: "Income Tax Basics",
      description: "Demystifying tax slabs, deductions, and filing.",
      type: "learn",
      category: "Tax",
    });
    await createSteps(taxLearnId, [
      {
        order: 1,
        title: "Old vs New Tax Regime",
        description: "Understand the two options for calculating tax.",
        actionChecklist: [
          "New Regime: Lower rates, no deductions",
          "Old Regime: Higher rates, many deductions (80C, HRA)",
        ],
      },
      {
        order: 2,
        title: "Key Deductions (Sec 80C)",
        description: "Save tax by investing.",
        actionChecklist: ["PPF, ELSS, LIC", "Max limit: ₹1.5 Lakhs"],
      },
      {
        order: 3,
        title: "Filing ITR",
        description: "When and how to file returns.",
        actionChecklist: [
          "Visit incometax.gov.in",
          "Due date is usually July 31st",
        ],
      },
    ]);

    // 7. Credit & Loans
    const creditLearnId = await insertWorkflow({
      title: "Credit Score & Loans",
      description: "How to build credit and borrow responsibly.",
      type: "learn",
      category: "Credit",
    });
    await createSteps(creditLearnId, [
      {
        order: 1,
        title: "What is CIBIL Score?",
        description: "A 3-digit number (300-900) reflecting creditworthiness.",
        actionChecklist: ["750+ is excellent", "Check for free once a year"],
      },
      {
        order: 2,
        title: "Good Debt vs Bad Debt",
        description: "Not all loans are bad.",
        actionChecklist: [
          "Good: Home loan, Education loan (Building assets)",
          "Bad: Credit card debt, Personal loan for luxury",
        ],
      },
      {
        order: 3,
        title: "Credit Card Best Practices",
        description: "Avoid debt traps.",
        actionChecklist: [
          "Pay full amount due, not minimum",
          "Keep utilization under 30%",
        ],
      },
    ]);

    // 8. Investments
    const investLearnId = await insertWorkflow({
      title: "Investment Basics",
      description: "Grow your money with stocks, mutual funds, and gold.",
      type: "learn",
      category: "Investing",
    });
    await createSteps(investLearnId, [
      {
        order: 1,
        title: "The Power of Compounding",
        description: "Money makes money over time.",
        actionChecklist: ["Start early", "Be consistent"],
      },
      {
        order: 2,
        title: "Mutual Funds",
        description: "Professional money management for beginners.",
        actionChecklist: [
          "SIP (Systematic Investment Plan)",
          "Equity vs Debt funds",
        ],
      },
      {
        order: 3,
        title: "Stock Market",
        description: "Buying shares of companies.",
        actionChecklist: ["Understand risk", "Long-term vs Trading"],
      },
    ]);

    // 9. Budgeting
    const budgetLearnId = await insertWorkflow({
      title: "Budgeting 101",
      description: "Master your monthly cash flow.",
      type: "learn",
      category: "Personal Finance",
    });
    await createSteps(budgetLearnId, [
      {
        order: 1,
        title: "The 50-30-20 Rule",
        description: "A simple budgeting framework.",
        actionChecklist: [
          "50% Needs (Rent, Food)",
          "30% Wants (Fun, Travel)",
          "20% Savings/Debt Repayment",
        ],
      },
      {
        order: 2,
        title: "Tracking Expenses",
        description: "Know where your money goes.",
        actionChecklist: ["Use an app or spreadsheet", "Review monthly"],
      },
      {
        order: 3,
        title: "Emergency Fund",
        description: "Prepare for the unexpected.",
        actionChecklist: [
          "Save 3-6 months of expenses",
          "Keep in liquid fund or savings account",
        ],
      },
    ]);

    console.log("Data Seeded Successfully with Expanded Content");
    process.exit();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

async function createSteps(workflowId, stepsData) {
  for (const stepData of stepsData) {
    await insertStep({
      workflow_id: workflowId,
      order: stepData.order,
      title: stepData.title,
      description: stepData.description,
      actionChecklist: stepData.actionChecklist,
    });
  }
}

seedData();

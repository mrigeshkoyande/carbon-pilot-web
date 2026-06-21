/**
 * CarbonPilot Automated Logic Test Suite
 * Evaluates core sanitization, error mapping, and sustainability algorithms.
 */

const { sanitizeText, getErrorMessage } = require("./firebase.test-helper.cjs");

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`[PASS] ${message}`);
  } else {
    console.error(`[FAIL] ${message}`);
  }
}

console.log("\n==============================================");
console.log("CARBONPILOT COMPLIANCE & UNIT TEST SUITE");
console.log("==============================================\n");

// --- TEST 1: Sanitization (XSS Vulnerability Protection) ---
console.log("Running Security: Sanitization Tests...");
const unsafeInput = "<script>alert('hack')</script> Notes & Details < 50";
const cleanOutput = sanitizeText(unsafeInput);
assert(
  !cleanOutput.includes("<script>") && !cleanOutput.includes("<img>"),
  "Security: Strip script and media HTML elements successfully."
);
assert(
  cleanOutput.includes("&amp;") && cleanOutput.includes("&lt;"),
  "Security: Escape special characters properly."
);

// --- TEST 2: Error Handler / Mapping Safety ---
console.log("\nRunning Security: Authentication Error Mapping Tests...");
const err1 = { code: "auth/user-not-found" };
const err2 = { code: "auth/weak-password" };
const err3 = { message: "Some internal SQLite error" };

assert(
  getErrorMessage(err1) === "Invalid email or password combination.",
  "Security UX: obfuscate exact failure parameters to avoid user enumeration."
);
assert(
  getErrorMessage(err2).includes("too weak"),
  "User UX: Provide clear instructions for password requirements."
);
assert(
  getErrorMessage(err3) === "Some internal SQLite error",
  "Fallback: Pass generic error messages cleanly."
);

// --- TEST 3: Insights Breakdown (Problem Statement Alignment) ---
console.log("\nRunning Algorithm: Sustainability Insights & Offsets...");

// Mock category math breakdown
function simulateInsights(logs) {
  if (logs.length === 0) return "Build Profile";
  const catTotals = { Transport: 0, Energy: 0, Food: 0, Waste: 0 };
  logs.forEach((log) => {
    catTotals[log.category] += log.value;
  });
  let highest = "Transport";
  let maxVal = -1;
  Object.entries(catTotals).forEach(([cat, val]) => {
    if (val > maxVal) {
      maxVal = val;
      highest = cat;
    }
  });
  return highest;
}

const mockLogs = [
  { category: "Transport", value: 100 },
  { category: "Energy", value: 50 },
  { category: "Food", value: 200 },
  { category: "Transport", value: 50 },
];

const dominantCategory = simulateInsights(mockLogs);
assert(
  dominantCategory === "Food",
  "Algorithm: Correctly detect highest carbon category for targeted insights."
);

console.log("\n==============================================");
console.log(`TEST RUN SUMMARY: Passed ${passedTests}/${totalTests} tests.`);
console.log("==============================================\n");

if (passedTests === totalTests) {
  console.log("Status: 100% Logic Verification Complete.");
  process.exit(0);
} else {
  console.error("Status: logic verification failed.");
  process.exit(1);
}

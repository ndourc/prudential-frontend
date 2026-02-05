// Simple smoke test script for compliance proxies
// Usage: node ./scripts/smoke-compliance.js

const base = process.env.FRONTEND_URL || "http://localhost:3000";
const endpoints = [
  "/api/compliance",
  "/api/compliance/index",
  "/api/compliance/assessments",
  "/api/compliance/violations",
  "/api/compliance/requirements",
];

async function run() {
  for (const ep of endpoints) {
    try {
      const url = `${base}${ep}`;
      console.log("Calling", url);
      const res = await fetch(url, { method: "GET" });
      const txt = await res.text();
      console.log("Status", res.status);
      try {
        const j = JSON.parse(txt);
        console.log("JSON:", JSON.stringify(j, null, 2));
      } catch {
        console.log("Raw:", txt);
      }
    } catch (e) {
      console.error("Error calling", ep, e);
    }
    console.log("-".repeat(40));
  }
}

run().then(() => console.log("Done"));

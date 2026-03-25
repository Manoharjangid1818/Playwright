const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { exec } = require("child_process");

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

// Rate limiter
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
});
app.use(limiter);

// RUN TEST API
app.post("/run-test", (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: "URL is required" });
  }

  console.log("Running Playwright test for:", url);

  // ✅ FIXED COMMAND (NO FILE PATH ISSUE)
  const command =
    process.platform === "win32"
      ? `set TEST_URL=${url} && npx playwright test`
      : `TEST_URL=${url} npx playwright test`;

  exec(command, { timeout: 60000 }, (error, stdout, stderr) => {
    if (error) {
      console.error("Test failed:", stderr);

      return res.json({
        status: "fail",
        message: "Test execution failed",
        error: stderr,
      });
    }

    return res.json({
      status: "success",
      message: "Test executed successfully",
      testedUrl: url,
      output: stdout,
    });
  });
});

module.exports = app;
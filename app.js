const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { chromium } = require("playwright");

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
});
app.use(limiter);

app.get("/", (req, res) => {
  res.send("QA360 Backend Running 🚀");
});

app.post("/run-test", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: "URL is required" });
  }

  console.log("Running REAL Playwright test for:", url);

  let browser;

  try {
    browser = await chromium.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu"
      ]
    });

    const page = await browser.newPage();

    await page.goto(url, {
      timeout: 30000,
      waitUntil: "domcontentloaded"
    });

    const title = await page.title();

    await page.screenshot({ path: "screenshot.png" });

    await browser.close();

    return res.json({
      status: "success",
      message: "Website loaded successfully",
      testedUrl: url,
      title: title
    });

  } catch (error) {
    if (browser) await browser.close();

    console.error("Error:", error.message);

    return res.json({
      status: "fail",
      message: "Test failed",
      error: error.message
    });
  }
});

module.exports = app;
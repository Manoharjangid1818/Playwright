const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.post("/run-test", async (req, res) => {
  const { url } = req.body || {};

  if (!url || typeof url !== "string") {
    return res.status(400).json({ message: "Please provide a valid URL." });
  }

  try {
    new URL(url);
  } catch (_error) {
    return res.status(400).json({ message: "Invalid URL format." });
  }

  return res.status(200).json({
    message: `Test request received for ${url}.`,
  });
});

app.listen(port, () => {
  console.log(`QA360 API listening on port ${port}`);
});

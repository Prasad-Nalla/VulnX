const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;
const SCANNER_URL = process.env.SCANNER_URL || "http://127.0.0.1:8000";

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("VulnX backend proxy is running.");
});

app.post("/scan/:action", async (req, res) => {
  const { action } = req.params;
  const allowed = ["headers", "phishing", "ports", "summary", "domain"];

  if (!allowed.includes(action)) {
    return res.status(404).json({ success: false, error: "Unknown scan action." });
  }

  try {
    const response = await axios.post(`${SCANNER_URL}/scan/${action}`, req.body, {
      timeout: 10000,
    });

    return res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }

    return res.status(500).json({
      success: false,
      error: error.message || "Scanner proxy error.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`VulnX backend proxy running on http://127.0.0.1:${PORT}`);
  console.log(`Forwarding scanner requests to ${SCANNER_URL}`);
});

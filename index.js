// This is your new, upgraded server code for Render.com
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

// Your Finnhub API key will be loaded securely from Render's environment
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

// --- Endpoint #1: Get Real-time Gold Price ---
app.get("/price", async (req, res) => {
  if (!FINNHUB_API_KEY) {
    return res.status(500).json({ error: "API key is not configured on the server." });
  }
  try {
    // We use a Forex symbol from Finnhub: OANDA:XAU_USD
    const response = await axios.get("https://finnhub.io/api/v1/quote", {
      params: {
        symbol: "OANDA:XAU_USD",
        token: FINNHUB_API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch real-time price." });
  }
});

// --- Endpoint #2: Get Weekly Chart Data ---
app.get("/weekly-data", async (req, res) => {
  if (!FINNHUB_API_KEY) {
    return res.status(500).json({ error: "API key is not configured on the server." });
  }
  try {
    const to = Math.floor(Date.now() / 1000); // Current time
    const from = to - (7 * 24 * 60 * 60);   // 7 days ago

    const response = await axios.get("https://finnhub.io/api/v1/forex/candle", {
      params: {
        symbol: "OANDA:XAU_USD",
        resolution: "60", // 60-minute candles
        from: from,
        to: to,
        token: FINNHUB_API_KEY,
      },
    });
    // Transform data for the charting library
    const chartData = response.data.t.map((timestamp, index) => ({
      time: timestamp,
      value: response.data.c[index] // Use the closing price
    }));
    res.json(chartData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch weekly chart data." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Gold data server is live on port ${PORT}`);
});

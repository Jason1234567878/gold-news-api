// This is the final, correct server code for Render.com

const express = require("express");
const axios = require("axios");
const cors = require("cors"); // Allows your WordPress site to talk to this server

const app = express();

// Use CORS to allow requests from any website.
app.use(cors());

// This is the main route for your news feed
app.get("/", async (req, res) => {
  const apiKey = "bed19db43d2f4ab8b25ddbb37011e7c1";
  const query = "gold";
  
  try {
    const newsResponse = await axios.get("https://newsapi.org/v2/everything", {
      params: {
        q: query,
        language: "en",
        sortBy: "publishedAt",
        apiKey: apiKey,
      },
    });
    // Send the clean JSON data back to your WordPress site
    res.json(newsResponse.data);

  } catch (error) {
    console.error("Error fetching news:", error.message);
    res.status(500).json({ error: "Failed to fetch news from NewsAPI" });
  }
});

// --- THIS IS THE MOST IMPORTANT PART THAT FIXES THE ERROR ---
// It tells the server to listen on the port Render provides (process.env.PORT)
// or on port 3000 if it's running somewhere else.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Our news server is live and listening on port ${PORT}`);
});

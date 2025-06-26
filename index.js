// This is the final, correct server code for Render.com

const express = require("express");
const axios = require("axios");
const cors = require("cors"); // Allows your WordPress site to talk to this server

const app = express();

// Use CORS to allow requests from any website.
app.use(cors());

// A simple "health check" route to see if the server is alive and responding.
// You can test this by going to https://your-render-url.onrender.com/health
app.get("/health", (req, res) => {
  res.status(200).send("Server is healthy and running!");
});

// This is the main route for your news feed.
// It will be triggered when your WordPress site calls the main URL.
app.get("/", async (req, res) => {
  // We log this to the Render logs so you can see when a request is received.
  console.log("Request received for news!"); 

  const apiKey = "bed19db43d2f4ab8b25ddbb37011e7c1";
  const query = "gold";
  
  try {
    // We will make the actual request to the NewsAPI server.
    const newsResponse = await axios.get("https://newsapi.org/v2/everything", {
      params: {
        q: query,
        language: "en",
        sortBy: "publishedAt",
        apiKey: apiKey,
      },
    });
    
    // We log this to show the API call was successful.
    console.log("Successfully fetched data from NewsAPI.");
    
    // Send the clean JSON data back to your WordPress site.
    res.json(newsResponse.data);

  } catch (error) {
    // If the API call fails, we log the error for debugging on Render.
    console.error("Error fetching news from NewsAPI:", error.message);
    
    // And send a simple error message back to your WordPress site.
    res.status(500).json({ error: "Failed to fetch news from the source API." });
  }
});

// --- THIS IS THE CRUCIAL PART THAT FIXES THE RENDER PORT ERROR ---
// It tells the server to listen on the specific port that Render assigns (process.env.PORT).
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Our news server is live and listening on port ${PORT}`);
});

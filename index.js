const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
app.use(cors());
// ... (the rest of the code is identical) ...
app.get("/", async (req, res) => { /* ... */ });
const listener = app.listen(process.env.PORT || 3000, () => { /* ... */ });

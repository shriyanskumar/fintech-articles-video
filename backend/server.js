require('dotenv').config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

const pool = require("./config/db");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/workflows", require("./routes/workflowRoutes"));

// No explicit DB connect needed; pool is initialized on import

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

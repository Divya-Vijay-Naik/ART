// server.js (or server/index.js)
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB without deprecated options
mongoose
  .connect("mongodb://127.0.0.1:27017/disaster-management")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit process with failure if MongoDB connection fails
  });

// Basic route to check if server is running
app.get("/", (req, res) => {
  res.send("Welcome to Disaster Management API");
});

// Import and use disaster routes
const disasterRoutes = require("./routes/disasters");
app.use("/api/disasters", disasterRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

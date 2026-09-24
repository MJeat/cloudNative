require("dotenv").config();

const express = require("express");
const connectDB = require("./config/DBConnect");
const registerRoutes = require("./routes/registerRoutes");

const app = express();

// Middleware
app.use(express.json());

// Database
connectDB();

// Routes
app.use("/register", registerRoutes);

// Health check
app.get("/", (req, res) => {
    res.json({
        message: "Registration Service is running"
    });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Registration Service running on port ${PORT}`);
});
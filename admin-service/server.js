require("dotenv").config();

const express = require("express");
const connectDB = require("./config/DBConnect");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(express.json());

connectDB();

app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Admin Service is running"
    });
});

const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {
    console.log(`Admin Service running on port ${PORT}`);
});
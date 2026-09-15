const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']); // Forces Node to use Google/Cloudflare DNS

require("dotenv").config();

const express = require("express");
const connectDB = require("./config/DBConnect");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(express.json());

connectDB();

app.use("/user", userRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "User Service is running"
    });
});

const PORT = process.env.PORT || 5004;

app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
});
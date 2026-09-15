const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']); // Forces Node to use Google/Cloudflare DNS

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
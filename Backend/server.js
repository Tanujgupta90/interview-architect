const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = require("./src/app");
const connectToDB = require("./src/config/database");

// CRITICAL FIREWALL ORDERING: Apply permissions before loading any API route layers
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://interview-architect-seven.vercel.app" // <-- Double check this matches your exact live Vercel URL
    ],
    credentials: true
}));

// Connect to MongoDB Atlas
connectToDB();

// Dynamic port fallback assignment for production servers
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});

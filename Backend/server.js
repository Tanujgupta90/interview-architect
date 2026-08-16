// 1. MUST BE LINE 1: Initialize environment variables before ANY other file imports
require("dotenv").config(); 

const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectToDB = require("./src/config/database");

// 2. Import the app after configuration values are safely globally available
const app = require("./src/app"); 

// Connect to MongoDB Atlas
connectToDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});

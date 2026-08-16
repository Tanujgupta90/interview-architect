const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectToDB = require("./src/config/database");

// 1. Initialize express app base layer
const app = express(); 

// 2. CRITICAL FIREWALL ORDERING: Apply permissions immediately
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://interview-architect-seven.vercel.app" 
    ],
    credentials: true
}));

// 3. Load your custom routes and application settings after CORS
require("./src/app")(app); // If your app module exports a function wrapping routes

// Connect to MongoDB Atlas
connectToDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});

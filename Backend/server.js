const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();
const connectToDB = require("./src/config/database");

// 1. IMPORT the pre-configured app directly from your src folder
const app = require("./src/app"); 

// Connect to MongoDB Atlas
connectToDB();

// 2. Set the port dynamically for Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});

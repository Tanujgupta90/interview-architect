const mongoose = require("mongoose");
const dns = require("dns");

// FORCE FIX: Tells Render to look up MongoDB using IPv4 addresses instead of broken IPv6 loops
dns.setDefaultResultOrder('ipv4first'); 

async function connectToDB() {
   try { 
       await mongoose.connect(process.env.MONGO_URI);
       console.log("connected to Database");
   }
   catch (err) {
       console.log("🔴 Connection Failed:", err.message);
   }
}

module.exports = connectToDB;

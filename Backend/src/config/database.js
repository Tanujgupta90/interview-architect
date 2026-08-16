const mongoose = require("mongoose");
const dns = require("dns");
require("dotenv").config(); // <-- Force verification check

dns.setDefaultResultOrder('ipv4first'); 

async function connectToDB() {
   try { 
       // Clean up any empty spacing typos from the string
       const uri = process.env.MONGO_URI ? process.env.MONGO_URI.trim() : null;
       
       if (!uri) {
           throw new Error("MONGO_URI environment variable is missing or undefined!");
       }

       await mongoose.connect(uri);
       console.log("connected to Database successfully");
   }
   catch (err) {
       console.log("🔴 Connection Failed:", err.message);
   }
}

module.exports = connectToDB;

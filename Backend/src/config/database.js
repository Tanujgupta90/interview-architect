const mongoose = require("mongoose")


async function connectToDB(){

   try { 
      //console.log(process.env.MONGO_URI)
    await mongoose.connect(process.env.MONGO_URI)

    console.log("connected to Database")
}
catch(err){
    console.log(err)
}
}

module.exports = connectToDB




// const mongoose = require("mongoose");
// const dns = require("dns");

// // Force Node.js to resolve addresses using IPv4 first (fixes Wi-Fi DNS bugs)
// dns.setDefaultResultOrder('ipv4first'); 

// async function connectToDB(){
//    try { 
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("connected to Database");
//    }
//    catch (err){
//     console.log("🔴 Connection Failed:", err.message);
//    }
// }

// module.exports = connectToDB;

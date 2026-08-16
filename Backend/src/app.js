const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin: function (origin, callback) {
        // 1. Allow local environment testing
        // 2. Allow any custom subdomain hosted on Vercel (.vercel.app)
        // 3. Allow requests without an origin (like mobile apps, curl, or Postman)
        if (!origin || origin.startsWith("http://localhost") || origin.endsWith("vercel.app")) {
            callback(null, true);
        } else {
            callback(new Error("Blocked by CORS authorization security policy."));
        }
    },
    credentials: true
}));


//require all the routes here
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")

//using all the routes here
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

module.exports = app

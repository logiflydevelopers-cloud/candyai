const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const callRoutes = require("./routes/callRoutes");

require("dotenv").config();
require("./cron");

const app = express();

/* ===============================
   CORS (IMPORTANT FIX)
=================================*/

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
}));

/* ===============================
   MIDDLEWARE
=================================*/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

app.use(session({
  secret: process.env.JWT_SECRET || "supersecret",
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

/* ===============================
   ROUTES
=================================*/

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/characters", require("./routes/characterRoutes"));
app.use("/api/banner", require("./routes/bannerRoutes"));
app.use("/api/story", require("./routes/storyRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));

// 🔥 NEW (Plans system add)
app.use("/api/plans", require("./routes/planRoutes"));
app.use("/api/tokens", require("./routes/tokenRoutes"));
app.use("/api/call", callRoutes);



/* ===============================
   TEST ROUTE
=================================*/

app.get("/", (req, res) => {
  res.json({ success: true, message: "Backend running 🚀" });
});

/* ===============================
   DATABASE
=================================*/

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));

/* ===============================
   START SERVER
=================================*/

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");

require("dotenv").config();

const app = express();

/* ===============================
   MIDDLEWARE
=================================*/

app.use(cors({
  origin: true,
  credentials: true
}));

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
app.use("/api/character", require("./routes/characterRoutes"));
app.use("/api/banner", require("./routes/bannerRoutes"));
app.use("/api/story", require("./routes/storyRoutes"));

app.get("/", (req, res) => {
  res.json({ success: true, message: "Backend running 🚀" });
});

/* ===============================
   DATABASE
=================================*/

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));

/* ===============================
   START SERVER (Render)
=================================*/

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
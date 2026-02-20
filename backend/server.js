const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");

require("dotenv").config();

const app = express();

/* ===============================
   BASIC SECURITY CHECK
=================================*/

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is missing in environment variables");
}

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
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true
  }
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

/* ===============================
   ROOT TEST ROUTE
=================================*/

app.get("/", (req, res) => {
  res.json({ success: true, message: "Backend running 🚀" });
});

/* ===============================
   DATABASE CONNECTION
=================================*/

if (!mongoose.connections[0].readyState) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("Mongo Error:", err));
}

/* ===============================
   LOCAL SERVER START
   (Vercel ignores this)
=================================*/

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});

export default app;

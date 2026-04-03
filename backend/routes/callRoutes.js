const express = require("express");
const router = express.Router();
const { startCall } = require("../controllers/callController");
const auth = require("../middleware/auth");

router.post("/start", auth, startCall);

const multer = require("multer");

// 📁 storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });

// 🎤 AUDIO UPLOAD ROUTE
router.post("/upload/audio", upload.single("audio"), (req, res) => {
    console.log("🎧 FILE SAVED:", req.file);

    res.json({
        success: true,
        file: req.file.filename,
    });
});

module.exports = router;
const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/auth");

const {
    createCharacter,
    getCharacters,
    deleteCharacter,
    updateCharacter,
    incrementChats,
    getCharacter,
    toggleLike // ✅ CHANGE
} = require("../controllers/characterController");


// CREATE CHARACTER
router.post(
    "/create",
    upload.fields([
        { name: "images", maxCount: 2 },
        { name: "video", maxCount: 1 },
        { name: "promptImage", maxCount: 1 },
        { name: "promptVideo", maxCount: 1 },
        { name: "unlockVideo", maxCount: 1 }
    ]),
    createCharacter
);

// GET ALL
router.get("/", getCharacters);

// GET SINGLE
router.get("/:id", getCharacter);

// UPDATE
router.put(
    "/:id",
    upload.fields([
        { name: "images", maxCount: 2 },
        { name: "video", maxCount: 1 },
        { name: "promptImage", maxCount: 1 },
        { name: "promptVideo", maxCount: 1 },
        { name: "unlockVideo", maxCount: 1 }
    ]),
    updateCharacter
);

// DELETE
router.delete("/:id", deleteCharacter);

// CHAT COUNT
router.post("/:id/chat", incrementChats);

// ✅ LIKE TOGGLE
router.put("/like/:id", authMiddleware, toggleLike);

module.exports = router;
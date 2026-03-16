const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
    createCharacter,
    getCharacters,
    deleteCharacter,
    updateCharacter,
    incrementChats,
    getCharacter,
    incrementLikes
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


// GET ALL CHARACTERS
router.get("/", getCharacters);


// GET SINGLE CHARACTER
router.get("/:id", getCharacter);


// UPDATE CHARACTER
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


// DELETE CHARACTER
router.delete("/:id", deleteCharacter);


// INCREMENT CHAT COUNT
router.post("/:id/chat", incrementChats);
router.put("/like/:id", incrementLikes);


module.exports = router;
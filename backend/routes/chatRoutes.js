const express = require("express");
const router = express.Router();

const chatController = require("../controllers/chatController");
const auth = require("../middleware/auth");

// existing routes
router.get("/open/:characterId", auth, chatController.openChat);
router.get("/list", auth, chatController.getConversations);
router.post("/message", auth, chatController.sendMessage);
router.get("/messages/:characterId", auth, chatController.getMessages);

router.get("/collection", auth, chatController.getCollection);

// NEW ROUTES
router.post("/reset/:characterId", auth, chatController.resetChat);
router.delete("/delete/:characterId", auth, chatController.deleteChat);

router.post("/image-message", auth, chatController.sendImageMessage);
router.post("/video-message", auth, chatController.sendVideoMessage);
router.post("/naughty-video-message", auth, chatController.sendNaughtyVideoMessage);



module.exports = router;
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
    createToken,
    getTokens,
    getToken,
    updateToken,
    deleteToken,
    buyToken,
} = require("../controllers/tokenController");


router.post("/buy", auth, buyToken);

// routes
router.post("/", createToken);
router.get("/", getTokens);
router.get("/:id", getToken);
router.put("/:id", updateToken);
router.delete("/:id", deleteToken);


module.exports = router;
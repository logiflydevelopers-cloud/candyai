const express = require("express");
const router = express.Router();

const {
    createPlan,
    getPlans,
    getAllPlans,
    updatePlan,
    deletePlan,
    buyPlan,        // 🔥 ADD
    getMyPlan       // 🔥 ADD
} = require("../controllers/planController");

const auth = require("../middleware/auth"); // 🔥 ADD


router.get("/my-plan", auth, getMyPlan);
router.post("/buy", auth, buyPlan);

// USER
router.get("/", getPlans);

// ADMIN
router.post("/", createPlan);
router.put("/:id", updatePlan);
router.delete("/:id", deletePlan);
router.get("/admin/all", getAllPlans);




module.exports = router;
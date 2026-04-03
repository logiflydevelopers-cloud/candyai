const Token = require("../models/Token");
const UserPlan = require("../models/UserPlan");


// ✅ CREATE TOKEN
exports.createToken = async (req, res) => {
    try {
        const data = req.body;

        // 🔥 AUTO DISCOUNT CALCULATION
        if (data.originalPrice && data.price) {
            data.discountPercent = Math.round(
                ((data.originalPrice - data.price) / data.originalPrice) * 100
            );
        }

        const token = await Token.create(data);

        res.status(201).json(token);

    } catch (err) {
        res.status(500).json({ message: "Create failed", error: err.message });
    }
};


// ✅ GET ALL TOKENS
exports.getTokens = async (req, res) => {
    try {
        const tokens = await Token.find().sort({ price: 1 });

        res.json(tokens);

    } catch (err) {
        res.status(500).json({ message: "Fetch failed" });
    }
};


// ✅ GET SINGLE TOKEN
exports.getToken = async (req, res) => {
    try {
        const token = await Token.findById(req.params.id);

        if (!token) {
            return res.status(404).json({ message: "Not found" });
        }

        res.json(token);

    } catch (err) {
        res.status(500).json({ message: "Error" });
    }
};


// ✅ UPDATE TOKEN
exports.updateToken = async (req, res) => {
    try {
        const data = req.body;

        if (data.originalPrice && data.price) {
            data.discountPercent = Math.round(
                ((data.originalPrice - data.price) / data.originalPrice) * 100
            );
        }

        const token = await Token.findByIdAndUpdate(
            req.params.id,
            data,
            { new: true }
        );

        res.json(token);

    } catch (err) {
        res.status(500).json({ message: "Update failed" });
    }
};


// ✅ DELETE TOKEN
exports.deleteToken = async (req, res) => {
    try {
        await Token.findByIdAndDelete(req.params.id);

        res.json({ message: "Deleted successfully" });

    } catch (err) {
        res.status(500).json({ message: "Delete failed" });
    }
};

// ✅ BUY TOKEN (ADD TOKENS TO USER)
exports.buyToken = async (req, res) => {
    try {
        console.log("REQ.USER:", req.user);
        console.log("BODY:", req.body);

        const { tokenId } = req.body;

        const token = await Token.findById(tokenId);
        if (!token) {
            return res.status(404).json({ message: "Token not found" });
        }

        const userId = req.user?.id || req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        let userPlan = await UserPlan.findOne({
            userId,
            isActive: true
        });

        if (!userPlan) {
            return res.status(400).json({
                message: "No active plan"
            });
        }

        if (!userPlan.isFreePlan) {
            userPlan.extraTokens += token.tokens;
        } else {
            return res.status(400).json({
                message: "Buy plan first to use extra tokens"
            });
        }

        // ✅ ADD THIS
        if (token.creditsLimit) {
            userPlan.extraCredits += token.creditsLimit;
        }

        if (token.chatTokenLimit) {
            userPlan.extraChatTokenLimit += token.chatTokenLimit;
        }

        await userPlan.save();

        res.json({
            success: true,
            message: "Tokens added successfully",
            data: userPlan
        });

    } catch (err) {
        console.log("BUY TOKEN ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};



const useToken = async (userId, tokensRequired) => {

    const plan = await UserPlan.findOne({
        userId,
        isActive: true
    });

    if (!plan) throw new Error("No active plan");

    // ❌ EXPIRED
    if (plan.endDate && new Date() > plan.endDate) {
        throw new Error("Plan expired");
    }

    let totalAvailable = 0;

    if (plan.isFreePlan) {
        totalAvailable = plan.planTokens; // 🔥 NO extra tokens
    } else {
        totalAvailable = plan.planTokens + plan.extraTokens;
    }

    if (totalAvailable < tokensRequired) {
        throw new Error("Not enough tokens");
    }

    // 🔥 Deduction priority
    if (plan.planTokens >= tokensRequired) {
        plan.planTokens -= tokensRequired;
    } else {
        let remaining = tokensRequired - plan.planTokens;
        plan.planTokens = 0;
        plan.extraTokens -= remaining;
    }

    await plan.save();
};
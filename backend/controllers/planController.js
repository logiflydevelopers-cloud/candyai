const Plan = require("../models/Plan");
const UserPlan = require("../models/UserPlan");


// CREATE
exports.createPlan = async (req, res) => {
    try {
        const {
            title,
            tokens,
            creditsLimit,
            chatTokenLimit,
            price,
            originalPrice,
            validity,
            label,
            tokenDistribution,
            monthlyTokens,
            isFreePlan
        } = req.body;

        // 🔥 HELPER FUNCTION
        const getMonthsFromValidity = (validity) => {
            if (validity === "1_month") return 1;
            if (validity === "3_months") return 3;
            if (validity === "6_months") return 6;
            if (validity === "1_year") return 12;
            return 0;
        };

        let finalMonthlyTokens = Number(monthlyTokens) || 0;

        // 🔥 AUTO DIVIDE
        if (tokenDistribution === "monthly" && !finalMonthlyTokens) {

            const months = getMonthsFromValidity(validity);

            if (months > 0) {
                finalMonthlyTokens = Math.floor(Number(tokens) / months);
            }
        }

        // 🔥 ONLY ONE FREE PLAN ALLOWED
        if (isFreePlan) {
            await Plan.updateMany(
                { isFreePlan: true },
                { isFreePlan: false }
            );
        }

        const plan = new Plan({
            title: title || "",
            tokens: Number(tokens) || 0,
            creditsLimit: Number(creditsLimit) || 0,
            chatTokenLimit: Number(chatTokenLimit) || 0,
            price: Number(price) || 0,
            originalPrice: Number(originalPrice) || 0,
            label: label || null,
            validity: validity || "none",

            tokenDistribution: tokenDistribution || "full",

            // 🔥 VERY IMPORTANT
            monthlyTokens: finalMonthlyTokens,


            isFreePlan: isFreePlan || false
        });

        // 🔥 AUTO DIVIDE
        if (tokenDistribution === "monthly" && !finalMonthlyTokens) {

            const months = getMonthsFromValidity(validity);

            if (months > 0) {
                finalMonthlyTokens = Math.floor(Number(tokens) / months);
            }
        }

        // discount
        if (plan.originalPrice > plan.price) {
            plan.discountPercent = Math.round(
                ((plan.originalPrice - plan.price) / plan.originalPrice) * 100
            );
        }

        await plan.save();

        res.json({ success: true, data: plan });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};

// GET
// USER SIDE (ONLY PAID PLANS)
exports.getPlans = async (req, res) => {
    try {
        const plans = await Plan.find({
            price: { $gt: 0 }   // 🔥 ONLY PAID
        }).sort({ createdAt: -1 });

        const cleanPlans = plans.map(p => ({
            ...p.toObject(),
            discountPercent: p.discountPercent || 0,
            originalPrice: p.originalPrice || 0,
            label: p.label || null
        }));

        res.json(cleanPlans);

    } catch (err) {
        console.log("GET PLANS ERROR:", err);
        res.status(500).json({ error: err.message });
    }
};


// ADMIN SIDE (ALL PLANS)
exports.getAllPlans = async (req, res) => {
    try {
        const plans = await Plan.find().sort({ createdAt: -1 });
        res.json(plans);
    } catch (err) {
        console.log("GET ALL PLANS ERROR:", err);
        res.status(500).json({ error: err.message });
    }
};

// UPDATE
exports.updatePlan = async (req, res) => {
    try {
        const { price, originalPrice, isFreePlan } = req.body;

        const finalPrice = Number(price);
        const finalOriginal = Number(originalPrice);

        let discountPercent = 0;

        if (finalOriginal > finalPrice) {
            discountPercent = Math.round(
                ((finalOriginal - finalPrice) / finalOriginal) * 100
            );
        }

        // 🔥 ONLY ONE FREE PLAN
        if (isFreePlan) {
            await Plan.updateMany(
                { isFreePlan: true },
                { isFreePlan: false }
            );
        }

        const updatedData = {
            ...req.body,
            price: finalPrice,
            originalPrice: finalOriginal,
            discountPercent,

            // 🔥 IMPORTANT FIX
            isFreePlan: isFreePlan || false
        };

        const plan = await Plan.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true }
        );

        res.json(plan);

    } catch (err) {
        console.log("UPDATE PLAN ERROR:", err);
        res.status(500).json({ error: err.message });
    }
};

// DELETE
exports.deletePlan = async (req, res) => {
    await Plan.findByIdAndDelete(req.params.id);
    res.json({ success: true });
};



exports.buyPlan = async (req, res) => {
    try {
        const { planId } = req.body;

        const plan = await Plan.findById(planId);
        if (!plan) return res.status(404).json({ message: "Plan not found" });

        const userId = req.user.id;

        let endDate = new Date();
        let tokensToGive = 0;
        let nextCreditDate = null;

        // FULL PLAN
        if (plan.tokenDistribution === "full") {
            tokensToGive = plan.tokens;
        }

        // MONTHLY PLAN
        if (plan.tokenDistribution === "monthly") {
            tokensToGive = plan.monthlyTokens;

            nextCreditDate = new Date();
            nextCreditDate.setMonth(nextCreditDate.getMonth() + 1);
        }

        if (plan.validity === "1_week") {
            endDate.setDate(endDate.getDate() + 7);
        } else if (plan.validity === "1_month") {
            endDate.setMonth(endDate.getMonth() + 1);
        } else if (plan.validity === "3_months") {
            endDate.setMonth(endDate.getMonth() + 3);
        } else if (plan.validity === "1_year") {
            endDate.setFullYear(endDate.getFullYear() + 1);
        }


        await UserPlan.updateMany(
            { userId, isActive: true },
            { isActive: false }
        );

        // 🔥 GET LAST INACTIVE PLAN
        const lastPlan = await UserPlan.findOne({
            userId,
            isActive: false,
            planType: "paid"
        }).sort({ createdAt: -1 });

        let carryForwardExtra = 0;

        if (lastPlan && lastPlan.lockedExtraTokens > 0) {
            carryForwardExtra = lastPlan.lockedExtraTokens;
        }

        const userPlan = await UserPlan.create({
            userId,
            planId,
            planName: plan.title,

            planType: "paid",
            isFreePlan: false,

            planTokens: tokensToGive,


            extraTokens: carryForwardExtra,
            lockedExtraTokens: 0,


            planCredits: plan.creditsLimit || 0,
            extraCredits: 0,

            chatTokenLimit: plan.chatTokenLimit || 0,
            extraChatTokenLimit: 0,

            tokenDistribution: plan.tokenDistribution,
            monthlyTokens: plan.monthlyTokens,

            nextCreditDate,
            endDate
        });

        res.json({
            success: true,
            message: "Plan activated successfully",
            data: userPlan
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};

exports.getMyPlan = async (req, res) => {
    const userId = req.user.id;

    let plan = await UserPlan.findOne({
        userId,
        isActive: true
    }).sort({ createdAt: -1 });

    // 🔥 NO ACTIVE PLAN → ASSIGN FREE PLAN
    if (!plan) {

        const freePlanData = await Plan.findOne({ isFreePlan: true });

        if (!freePlanData) {
            return res.status(500).json({ message: "Free plan not configured" });
        }

        const freePlan = await UserPlan.create({
            userId,

            planId: freePlanData._id,
            planName: freePlanData.title,

            planType: "free",
            isFreePlan: true,

            planTokens: freePlanData.tokens || 0,
            extraTokens: 0,

            planCredits: freePlanData.creditsLimit || 0,
            extraCredits: 0,

            chatTokenLimit: freePlanData.chatTokenLimit || 0,
            extraChatTokenLimit: 0,

            tokenDistribution: freePlanData.tokenDistribution || "full",
            monthlyTokens: freePlanData.monthlyTokens || 0,

            isActive: true
        });

        return res.json({
            active: false,
            plan: freePlan
        });
    }

    // 🔥 EXPIRE CHECK
    if (plan.endDate && new Date() > plan.endDate) {

        plan.isActive = false;
        await plan.save();

        const freePlanData = await Plan.findOne({ isFreePlan: true });

        if (!freePlanData) {
            return res.status(500).json({ message: "Free plan not configured" });
        }

        const freePlan = await UserPlan.create({
            userId,

            planId: freePlanData._id,
            planName: freePlanData.title,

            planType: "free",
            isFreePlan: true,

            planTokens: freePlanData.tokens || 0,

            // 🔥 LOCK EXTRA TOKENS
            extraTokens: 0,
            lockedExtraTokens: plan.extraTokens || 0,

            planCredits: freePlanData.creditsLimit || 0,
            extraCredits: plan.extraCredits || 0,

            chatTokenLimit: freePlanData.chatTokenLimit || 0,
            extraChatTokenLimit: 0,

            tokenDistribution: freePlanData.tokenDistribution || "full",
            monthlyTokens: freePlanData.monthlyTokens || 0,

            isActive: true
        });

        return res.json({
            active: false,
            plan: freePlan
        });
    }

    // 🔥 NORMAL RESPONSE
    return res.json({
        active: true,
        plan: {
            ...plan.toObject(),

            tokens: {
                plan: plan.planTokens,
                extra: plan.extraTokens,
                total: plan.planTokens + plan.extraTokens
            },

            credits: {
                plan: plan.planCredits,
                extra: plan.extraCredits,
                total: plan.planCredits + plan.extraCredits
            },

            chatTokens: {
                plan: plan.chatTokenLimit,
                extra: plan.extraChatTokenLimit || 0,
                total: (plan.chatTokenLimit || 0) + (plan.extraChatTokenLimit || 0)
            }
        }
    });
};
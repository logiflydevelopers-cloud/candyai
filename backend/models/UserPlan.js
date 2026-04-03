const mongoose = require("mongoose");

const userPlanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    planId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plan",
        required: false
    },

    planName: String,

    planType: {
        type: String,
        enum: ["free", "paid"],
        default: "free"
    },

    isFreePlan: {
        type: Boolean,
        default: false
    },

    // 🔥 TOKENS
    planTokens: {
        type: Number,
        default: 0
    },

    extraTokens: {
        type: Number,
        default: 0
    },

    lockedExtraTokens: {
        type: Number,
        default: 0
    },

    // 🔥 CREDITS
    planCredits: {
        type: Number,
        default: 0
    },

    extraCredits: {
        type: Number,
        default: 0
    },

    // 🔥 CHAT TOKENS
    chatTokenLimit: {
        type: Number,
        default: 0
    },

    extraChatTokenLimit: {
        type: Number,
        default: 0
    },

    // 🔥 TOTALS (AUTO CALCULATED)
    totalTokens: {
        type: Number,
        default: 0
    },

    totalCredits: {
        type: Number,
        default: 0
    },

    totalChatTokens: {
        type: Number,
        default: 0
    },

    startDate: {
        type: Date,
        default: Date.now
    },

    endDate: Date,

    isActive: {
        type: Boolean,
        default: true
    },

    tokenDistribution: String,

    monthlyTokens: {
        type: Number,
        default: 0
    },

    nextCreditDate: Date

}, { timestamps: true });


userPlanSchema.pre("save", function (next) {

    this.totalTokens = (this.planTokens || 0) + (this.extraTokens || 0);

    this.totalCredits = (this.planCredits || 0) + (this.extraCredits || 0);

    this.totalChatTokens =
        (this.chatTokenLimit || 0) + (this.extraChatTokenLimit || 0);

    next();
});

module.exports = mongoose.model("UserPlan", userPlanSchema);
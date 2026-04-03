const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
    title: String,

    tokens: { type: Number, default: 0 },

    creditsLimit: { type: Number, default: 0 },

    chatTokenLimit: { type: Number, default: 0 },

    price: Number,
    originalPrice: Number,
    discountPercent: Number,

    label: String,

    validity: {
        type: String,
        enum: ["none", "1_week", "1_month", "3_months", "6_months", "1_year"],
        default: "none",
    },

    // 🔥 NEW FIELD
    tokenDistribution: {
        type: String,
        enum: ["full", "monthly"],
        default: "full"
    },

    // 🔥 per month tokens (optional but useful)
    monthlyTokens: {
        type: Number,
        default: 0
    },

    isFreePlan: {
        type: Boolean,
        default: false
    },

}, { timestamps: true });

module.exports = mongoose.model("Plan", planSchema);
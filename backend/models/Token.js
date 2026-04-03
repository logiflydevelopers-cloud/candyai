const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
    {
        tokens: {
            type: Number,
            required: true,
        },


        creditsLimit: {
            type: Number,
            default: 0
        },

        chatTokenLimit: {
            type: Number,
            default: 0
        },

        price: {
            type: Number,
            required: true,
        },

        originalPrice: {
            type: Number,
        },

        label: {
            type: String, // "+200% bonus"
        },

        discountPercent: {
            type: Number,
            default: 0,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Token", tokenSchema);
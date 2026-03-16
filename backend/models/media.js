const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    characterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Character"
    },

    type: {
        type: String,
        enum: ["image", "video"]
    },

    media: String,

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Media", mediaSchema);
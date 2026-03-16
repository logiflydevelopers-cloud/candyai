const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    characterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Character"
    },

    images: [
        {
            type: String
        }
    ],

    videos: [
        {
            type: String
        }
    ],

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Collection", collectionSchema);
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({

    sender: {
        type: String,
        enum: ["user", "bot"]
    },

    type: {
        type: String,
        enum: ["text", "image", "video", "locked"],
        default: "text"
    },

    text: String,

    media: String, // image or video filename

    createdAt: {
        type: Date,
        default: Date.now
    }

});

const messageSchema = new mongoose.Schema({

    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation"
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    characterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Character"
    },

    messages: [chatSchema]

});

module.exports = mongoose.model("Message", messageSchema);
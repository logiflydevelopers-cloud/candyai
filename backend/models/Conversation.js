const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    characterId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Character"
    },

    lastMessage:String,

    lastTime:Date,

    // NEW FIELD
    suggestionStage:{
        type:String,
        default:null
    }

});

module.exports = mongoose.model("Conversation",conversationSchema);
const mongoose = require("mongoose");

const CharacterSchema = new mongoose.Schema({

  uniqueId: {
    type: String,
    required: true,
    unique: true
  },

  // MAIN CATEGORY (Girls / Guys / Anime)
  category: {
    type: String,
    enum: ["Guys", "Girls", "Anime"]
  },

  name: String,

  images: [String],

  video: String,

  welcomeMessage: String,

  promptMedia: [
    {
      image: String,
      imagePrompt: String,
      video: String,
      videoPrompt: String,
      unlockVideo: String,
      unlockVideoPrompt: String
    }
  ],

  location: String,

  age: Number,

  body: String,

  ethnicity: String,

  language: String,

  relationship: String,

  occupation: String,

  hobbies: String,

  personality: String,

  // FILTER TAGS (Latina / Asian / Milf etc)
  categories: [String],

  description: String,

  discover: {
    type: Boolean,
    default: false
  },

  label: {
    type: String,
    enum: ["none", "new", "hot", "trending", "popular"],
    default: "none"
  },

  likes: {
    type: Number,
    default: 0
  },

  likedBy: [
    {
      type: String
    }
  ],

  chats: {
    type: Number,
    default: 0
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Character", CharacterSchema);
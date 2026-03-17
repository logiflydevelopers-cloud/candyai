const mongoose = require("mongoose");

/* ===============================
   STORY ITEM (IMAGE / VIDEO)
=================================*/
const storyItemSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
    min: 1,
    max: 4
  },
  type: {
    type: String,
    enum: ["image", "video"],
    required: true
  },
  mediaUrl: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/* ===============================
   CHARACTER SCHEMA
=================================*/
const characterSchema = new mongoose.Schema({
  characterName: {
    type: String,
    required: true
  },

  profileImage: {
    type: String,
    required: true
  },

  isLive: {
    type: Boolean,
    default: false
  },

  stories: {
    type: [storyItemSchema],
    validate: [
      (arr) => arr.length <= 4,
      "Max 4 stories allowed"
    ]
  }
});

/* ===============================
   MAIN CATEGORY SCHEMA
=================================*/
const storySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      unique: true // 🔥 one doc per category (Guys/Girls/Anime)
    },

    characters: {
      type: [characterSchema],
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Story", storySchema);
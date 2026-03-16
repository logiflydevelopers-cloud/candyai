const Character = require("../models/Character");

// CREATE
exports.createCharacter = async (req, res) => {

  try {

    const images = req.files?.images?.map(file => file.filename) || [];
    const video = req.files?.video ? req.files.video[0].filename : null;
    const promptImage = req.files?.promptImage ? req.files.promptImage[0].filename : null;
    const promptVideo = req.files?.promptVideo ? req.files.promptVideo[0].filename : null;
    const unlockVideo = req.files?.unlockVideo ? req.files.unlockVideo[0].filename : null;

    const character = new Character({

      uniqueId: req.body.uniqueId,
      name: req.body.name,
      age: req.body.age,
      location: req.body.location,
      category: req.body.category,

      images,
      video,
      welcomeMessage: req.body.welcomeMessage,

      promptMedia: [
        {
          image: promptImage,
          imagePrompt: req.body.imagePrompt,
          video: promptVideo,
          videoPrompt: req.body.videoPrompt,
          unlockVideo: unlockVideo,
          unlockVideoPrompt: req.body.unlockVideoPrompt
        }
      ],

      body: req.body.body,
      ethnicity: req.body.ethnicity,
      language: req.body.language,
      relationship: req.body.relationship,
      occupation: req.body.occupation,
      hobbies: req.body.hobbies,
      personality: req.body.personality,
      categories: JSON.parse(req.body.categories || "[]"),
      label: req.body.label,
      description: req.body.description,
      likes: req.body.likes || 0,
      chats: req.body.chats || 0,

      discover: req.body.discover === "true"

    });

    await character.save();

    res.json({ success: true });

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

};

exports.incrementChats = async (req, res) => {

  await Character.findByIdAndUpdate(
    req.params.id,
    { $inc: { chats: 1 } }
  );

  res.json({ success: true });

};


// GET ALL CHARACTERS
exports.getCharacters = async (req, res) => {
  try {

    const filter = {};

    // MAIN CATEGORY
    if (req.query.main) {

      const main = req.query.main.toLowerCase();

      if (main === "girls") filter.category = "Girls";
      if (main === "guys") filter.category = "Guys";
      if (main === "anime") filter.category = "Anime";

    }

    // CATEGORY FILTER
    if (req.query.category && req.query.category !== "All") {
      filter.categories = { $in: [req.query.category] };
    }

    // SEARCH
    if (req.query.search) {

      const search = req.query.search;

      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } }
      ];

    }

    const characters = await Character
      .find(filter)
      .sort({ createdAt: -1 });

    res.json(characters);

  } catch (err) {

    res.status(500).json({ error: err.message });

  }
};

// GET SINGLE CHARACTER
exports.getCharacter = async (req, res) => {

  try {

    const character = await Character.findById(req.params.id);

    if (!character) {
      return res.status(404).json({ error: "Character not found" });
    }

    res.json(character);

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

};


// DELETE
exports.deleteCharacter = async (req, res) => {

  await Character.findByIdAndDelete(req.params.id);

  res.json({ success: true });

};


// UPDATE
exports.updateCharacter = async (req, res) => {

  try {

    const character = await Character.findById(req.params.id);

    if (!character) {
      return res.status(404).json({ error: "Character not found" });
    }

    const images =
      req.files?.images?.map(file => file.filename) || character.images;

    const video =
      req.files?.video?.[0]?.filename || character.video;

    const promptImage =
      req.files?.promptImage?.[0]?.filename || character.promptMedia?.[0]?.image;

    const promptVideo =
      req.files?.promptVideo?.[0]?.filename || character.promptMedia?.[0]?.video;

    const unlockVideo =
      req.files?.unlockVideo?.[0]?.filename || character.promptMedia?.[0]?.unlockVideo;

    character.uniqueId = req.body.uniqueId;
    character.name = req.body.name;
    character.age = req.body.age;
    character.location = req.body.location;

    character.images = images;
    character.video = video;

    character.body = req.body.body;
    character.ethnicity = req.body.ethnicity;
    character.language = req.body.language;
    character.relationship = req.body.relationship;
    character.occupation = req.body.occupation;
    character.hobbies = req.body.hobbies;
    character.personality = req.body.personality;
    character.category = req.body.category;

    character.categories = JSON.parse(req.body.categories || "[]");
    character.label = req.body.label;

    character.description = req.body.description;
    character.welcomeMessage = req.body.welcomeMessage;

    character.likes = req.body.likes;
    character.chats = req.body.chats;

    character.discover = req.body.discover === "true";

    character.promptMedia = [
      {
        image: promptImage,
        imagePrompt: req.body.imagePrompt,
        video: promptVideo,
        videoPrompt: req.body.videoPrompt,
        unlockVideo: unlockVideo,
        unlockVideoPrompt: req.body.unlockVideoPrompt
      }
    ];

    await character.save();

    res.json({ success: true });

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

};


// LIKE INCREMENT
exports.incrementLikes = async (req, res) => {

  try {

    const character = await Character.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    res.json(character);

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

};
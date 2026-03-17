const express = require("express");
const router = express.Router();
const multer = require("multer");
const Story = require("../models/Story");

/* ===============================
   MULTER CONFIG
=================================*/
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {

  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "video/mp4",
    "video/mov",
    "video/webm"
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, WEBP, MP4 allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter
});

/* ===============================
   GET STORIES (category → characters[])
=================================*/
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({ message: "Category required" });
    }

    const data = await Story.findOne({ category });

    if (!data) return res.json([]);

    res.json(data.characters); // 🔥 MUST

  } catch (err) {
    console.error("ADD ERROR:", err);

    if (err.message.includes("Only")) {
      return res.status(400).json({ message: err.message });
    }

    res.status(500).json({ message: "Server error" });
  }
});

/* ===============================
   ADD STORY
=================================*/
router.post(
  "/add",
  upload.fields([
    { name: "media", maxCount: 1 },
    { name: "profileImage", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const { category, characterName, number } = req.body;

      if (!category || !characterName || !number) {
        return res.status(400).json({ message: "All fields required" });
      }

      const mediaFile = req.files?.media?.[0];
      const profileFile = req.files?.profileImage?.[0];

      if (!mediaFile) {
        return res.status(400).json({ message: "Story media required" });
      }

      let categoryDoc = await Story.findOne({ category });

      // 🔥 CREATE CATEGORY
      if (!categoryDoc) {
        categoryDoc = new Story({
          category,
          characters: []
        });
      }

      // 🔥 FIND CHARACTER
      let character = categoryDoc.characters.find(
        (c) => c.characterName === characterName
      );

      /* ================= NEW CHARACTER ================= */
      if (!character) {
        if (!profileFile) {
          return res.status(400).json({
            message: "Profile image required for new character"
          });
        }

        categoryDoc.characters.push({
          characterName,
          profileImage: profileFile.filename,
          isLive: false,
          stories: [
            {
              number: Number(number),
              type: mediaFile.mimetype.startsWith("video")
                ? "video"
                : "image",
              mediaUrl: mediaFile.filename
            }
          ]
        });
      } else {
        /* ================= EXISTING CHARACTER ================= */

        if (character.stories.length >= 4) {
          return res.status(400).json({
            message: "Only 4 stories allowed"
          });
        }

        const exists = character.stories.find(
          (s) => s.number === Number(number)
        );

        if (exists) {
          return res.status(400).json({
            message: "Story number already exists"
          });
        }

        character.stories.push({
          number: Number(number),
          type: mediaFile.mimetype.startsWith("video")
            ? "video"
            : "image",
          mediaUrl: mediaFile.filename
        });
      }

      await categoryDoc.save();

      res.json({ message: "Story added successfully" });

    } catch (err) {
      console.error("ADD ERROR:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* ===============================
   UPDATE COVER (character level)
=================================*/
router.put(
  "/update-cover/:id",
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const categoryDoc = await Story.findOne({
        "characters._id": req.params.id
      });

      if (!categoryDoc) {
        return res.status(404).json({ message: "Not found" });
      }

      const character = categoryDoc.characters.id(req.params.id);

      if (!req.file) {
        return res.status(400).json({ message: "Image required" });
      }

      character.profileImage = req.file.filename;

      await categoryDoc.save();

      res.json({ message: "Cover updated successfully" });

    } catch (err) {
      console.error("UPDATE COVER ERROR:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* ===============================
   TOGGLE LIVE
=================================*/
router.put("/toggle-live/:id", async (req, res) => {
  try {
    const categoryDoc = await Story.findOne({
      "characters._id": req.params.id
    });

    if (!categoryDoc) {
      return res.status(404).json({ message: "Not found" });
    }

    const character = categoryDoc.characters.id(req.params.id);

    character.isLive = !character.isLive;

    await categoryDoc.save();

    res.json({ message: "Live updated" });

  } catch (err) {
    console.error("LIVE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ===============================
   DELETE CHARACTER
=================================*/
router.delete("/:id", async (req, res) => {
  try {
    const categoryDoc = await Story.findOne({
      "characters._id": req.params.id
    });

    if (!categoryDoc) {
      return res.status(404).json({ message: "Not found" });
    }

    categoryDoc.characters.pull(req.params.id);

    await categoryDoc.save();

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
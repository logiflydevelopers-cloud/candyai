const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Character = require("../models/Character");

const { askAI } = require("../services/pythonService");
const Collection = require("../models/Collection");



// open chat
exports.openChat = async (req, res) => {

    const userId = req.user.id;
    const { characterId } = req.params;

    let convo = await Conversation.findOne({
        userId,
        characterId
    });

    if (!convo) {

        const character = await Character.findById(characterId);

        convo = await Conversation.create({
            userId,
            characterId,
            lastMessage: character.welcomeMessage,
            lastTime: new Date()
        });

        await Message.create({

            conversationId: convo._id,
            userId,
            characterId,
            messages: [{
                sender: "bot",
                text: character.welcomeMessage
            }]

        });

    }

    res.json({
        conversation: convo,
        suggestion: convo.suggestionStage
    });

};



// get conversations
exports.getConversations = async (req, res) => {

    const userId = req.user.id;

    const chats = await Conversation
        .find({ userId })
        .populate("characterId")
        .sort({ lastTime: -1 });

    res.json(chats);

};



// send message
exports.sendMessage = async (req, res) => {

    const userId = req.user.id;
    const { characterId, question } = req.body;

    const convo = await Conversation.findOne({
        userId,
        characterId
    });

    let messageDoc = await Message.findOne({
        conversationId: convo._id
    });

    if (!messageDoc) {
        messageDoc = await Message.create({
            conversationId: convo._id,
            userId,
            characterId,
            messages: []
        });
    }

    // user message add
    messageDoc.messages.push({
        sender: "user",
        type: "text",
        text: question
    });

    const ai = await askAI(characterId, userId, question);

    // bot message add
    const replyText = ai?.answer || ai?.reply || "⚠️ AI response error";

    // count user messages
    const userCount = messageDoc.messages.filter(
        m => m.sender === "user"
    ).length;

    let suggestion = null;

    // 2 message પછી image
    if (userCount === 2 && !convo.suggestionStage) {

        suggestion = "image";
        convo.suggestionStage = "image";

    }

    // image પછી video
    else if (convo.suggestionStage === "image") {

        suggestion = "video";

    }

    // video પછી naughty
    else if (convo.suggestionStage === "video") {

        suggestion = "naughty";

    }

    await convo.save();

    messageDoc.messages.push({
        sender: "bot",
        type: "text",
        text: replyText,
        suggestion: suggestion,
        createdAt: new Date()
    });

    await messageDoc.save();

    convo.lastMessage = replyText;
    convo.lastTime = new Date();
    await convo.save();

    res.json({
        reply: replyText,
        suggestion
    });

};


// get messages of conversation
exports.getMessages = async (req, res) => {

    const userId = req.user.id;
    const { characterId } = req.params;

    const convo = await Conversation.findOne({
        userId,
        characterId
    });

    const messageDoc = await Message.findOne({
        conversationId: convo._id
    });

    if (!messageDoc) return res.json([]);

    res.json(messageDoc.messages);

};


// reset chat (clear messages but keep conversation)
exports.resetChat = async (req, res) => {

    const userId = req.user.id;
    const { characterId } = req.params;

    const convo = await Conversation.findOne({
        userId,
        characterId
    });

    if (!convo)
        return res.status(404).json({ message: "Conversation not found" });

    const character = await Character.findById(characterId);

    // delete old message doc
    await Message.deleteMany({
        conversationId: convo._id
    });

    // create new doc with welcome message
    await Message.create({
        conversationId: convo._id,
        userId,
        characterId,
        messages: [
            {
                sender: "bot",
                text: character.welcomeMessage
            }
        ]
    });

    convo.lastMessage = character.welcomeMessage;
    convo.lastTime = new Date();

    await convo.save();

    res.json({ message: "Chat reset" });

};



// delete conversation completely
exports.deleteChat = async (req, res) => {

    const userId = req.user.id;
    const { characterId } = req.params;

    const convo = await Conversation.findOne({
        userId,
        characterId
    });

    if (!convo) return res.status(404).json({ message: "Conversation not found" });

    await Message.deleteMany({
        conversationId: convo._id
    });

    await convo.deleteOne();

    res.json({ message: "Chat deleted" });

};


exports.sendImage = async (req, res) => {

    const { characterId } = req.body;

    const character = await Character.findById(characterId);

    const media = character.promptMedia[0];

    res.json({
        image: media.image,
        text: media.imagePrompt
    });

};


exports.sendVideo = async (req, res) => {

    const { characterId } = req.body;

    const character = await Character.findById(characterId);

    const media = character.promptMedia[0];

    res.json({
        video: media.video,
        text: media.videoPrompt
    });

};



exports.sendImageMessage = async (req, res) => {

    const userId = req.user.id;
    const { characterId } = req.body;

    const convo = await Conversation.findOne({
        userId,
        characterId
    });

    convo.suggestionStage = "video";
    await convo.save();

    const messageDoc = await Message.findOne({
        conversationId: convo._id
    });

    const character = await Character.findById(characterId);
    const media = character.promptMedia[0];

    // user message
    const userMessage = {
        sender: "user",
        type: "text",
        text: "📸 Send me an image",
        createdAt: new Date()
    };

    // bot message
    const botMessage = {
        sender: "bot",
        type: "image",
        media: media.image,
        text: media.imagePrompt,
        createdAt: new Date()
    };

    messageDoc.messages.push(userMessage);
    messageDoc.messages.push(botMessage);

    await messageDoc.save();

    let collection = await Collection.findOne({
        userId,
        characterId
    });

    if (collection) {

        collection.images.push(media.image);
        await collection.save();

    } else {

        await Collection.create({
            userId,
            characterId,
            images: [media.image],
            videos: []
        });

    }


    res.json({
        userMessage,
        botMessage
    });
};

exports.sendVideoMessage = async (req, res) => {

    const userId = req.user.id;
    const { characterId } = req.body;

    const convo = await Conversation.findOne({
        userId,
        characterId
    });

    const messageDoc = await Message.findOne({
        conversationId: convo._id
    });

    convo.suggestionStage = "naughty";
    await convo.save();

    const character = await Character.findById(characterId);
    const media = character.promptMedia[0];

    const userMessage = {
        sender: "user",
        type: "text",
        text: "🎥 Send me a video",
        createdAt: new Date()
    };

    const botMessage = {
        sender: "bot",
        type: "video",
        media: media.video,
        text: media.videoPrompt,
        createdAt: new Date()
    };

    messageDoc.messages.push(userMessage);
    messageDoc.messages.push(botMessage);

    await messageDoc.save();

    let collection = await Collection.findOne({
        userId,
        characterId
    });

    if (collection) {

        collection.videos.push(media.video);
        await collection.save();

    } else {

        await Collection.create({
            userId,
            characterId,
            images: [],
            videos: [media.video]
        });

    }

    res.json({
        userMessage,
        botMessage
    });
};

exports.sendNaughtyVideoMessage = async (req, res) => {

    const userId = req.user.id;
    const { characterId } = req.body;

    let convo = await Conversation.findOne({
        userId,
        characterId
    });

    if (!convo) {

        convo = await Conversation.create({
            userId,
            characterId,
            lastMessage: "",
            lastTime: new Date()
        });

    }

    let messageDoc = await Message.findOne({
        conversationId: convo._id
    });

    if (!messageDoc) {

        messageDoc = await Message.create({
            conversationId: convo._id,
            userId,
            characterId,
            messages: []
        });

    }

    const character = await Character.findById(characterId);
    const media = character.promptMedia[0];

    const userMessage = {
        sender: "user",
        type: "text",
        text: "🔥 Send me a naughty video",
        createdAt: new Date()
    };

    const botMessage = {
        sender: "bot",
        type: "locked",
        media: media.unlockVideo,
        text: media.unlockVideoPrompt || "",
        createdAt: new Date()
    };

    messageDoc.messages.push(userMessage);
    messageDoc.messages.push(botMessage);

    await messageDoc.save();


    res.json({
        userMessage,
        botMessage
    });

};


exports.getCollection = async (req, res) => {

    const userId = req.user.id;

    const items = await Collection
        .find({ userId })
        .populate("characterId")
        .sort({ createdAt: -1 });

    res.json(items);
};
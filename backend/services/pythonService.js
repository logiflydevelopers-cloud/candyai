const axios = require("axios");

exports.askAI = async (characterId, userId, question) => {

    const res = await axios.post("https://candyai-chat.onrender.com/chat/message", {

        characterId,
        userId,
        question

    });

    return res.data;

};
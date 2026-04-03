const axios = require("axios");


const getTokenWithRetry = async (data, retries = 3) => {
    try {
        return await axios.post(
            "https://candyai-voiceagent.onrender.com/get-token",
            data,
            { timeout: 60000 }
        );
    } catch (err) {
        console.log("❌ Attempt failed:", err.message);

        if (retries > 0) {
            console.log("🔁 Retrying...", retries);

            // ⏳ small delay (IMPORTANT)
            await new Promise(res => setTimeout(res, 2000));

            return getTokenWithRetry(data, retries - 1);
        }

        throw err;
    }
};

exports.startCall = async (req, res) => {
    try {
        const userId = req.user.id;
        const { characterId } = req.body;

        if (!characterId) {
            return res.status(400).json({ message: "Character ID required" });
        }


        await axios.get("https://candyai-voiceagent.onrender.com");

        const response = await getTokenWithRetry({
            user_id: userId,
            character_id: characterId
        });
        console.log("🔥 PYTHON RAW RESPONSE:", response.data);

        const { token, url, room } = response.data;

        res.json({
            token,
            url,
            roomName: room,
        });

    } catch (err) {
        console.log(err?.response?.data || err.message);
        console.log("❌ FULL ERROR:");
        console.log("STATUS:", err?.response?.status);
        console.log("DATA:", err?.response?.data);
        console.log("MESSAGE:", err.message);

        res.status(500).json({
            message: "Call start failed",
        });
    }
};
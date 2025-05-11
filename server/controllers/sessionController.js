const { requestSession } = require("../services/sessionService");

const createSession = async (req, res) => {
    const {
        title,
        category,
        description,
        senderId,
        receiverId,
        tags,
        duration,
        inExchange,
        creditExchange,
        startTime,
        topic,
        exchangeTopic
    } = req.body;

    try{
        const newSession = await requestSession(
            title,
            category,
            description,
            senderId,
            receiverId,
            tags,
            duration,
            inExchange,
            creditExchange,
            startTime,
            topic,
            exchangeTopic
        );
        res.status(201).json({
            message: "Session created successfully",
            data: newSession,
        });
    }catch(err){
        res.status(500).json({
            message: err.message
        });
    }
}

module.exports = {
    createSession
}
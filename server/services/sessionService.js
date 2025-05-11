const Session = require("../models/Session");

const requestSession = async (title, category, description, senderId, receiverId, tags, duration, inExchange, creditExchange, startTime, topic, exchangeTopic) => {
    try{
        if(!title || !category || !description || !tags || !duration || !inExchange){
            throw new Error("All fields are required");
        }
        if(!senderId) senderId = null;
        if(!receiverId) receiverId = null;
        if(!creditExchange) creditExchange = null;
        if(!startTime) startTime = null;
        if(!topic) topic = null;
        if(!exchangeTopic) exchangeTopic = null;
        if(!inExchange) inExchange = null;
        if(!duration) duration = null;
        if(!description) description = null;
        if(!tags) tags = null;
        if(!category) category = null;
        
        const newSession = await Session.create({
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
        });
        return {
            id: newSession.id,
            title: newSession.title,
            category: newSession.category,
            description: newSession.description,
            senderId: newSession.senderId,
            receiverId: newSession.receiverId,
            tags: newSession.tags,
            duration: newSession.duration,
            inExchange: newSession.inExchange,
            creditExchange: newSession.creditExchange,
            startTime: newSession.startTime,
            topic: newSession.topic,
            exchangeTopic: newSession.exchangeTopic
        };
    }catch(error){
        throw new Error(error.message);
    }
}

module.exports = {
    requestSession
}
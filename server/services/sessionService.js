const Session = require("../models/Session");
const {Op} = require("sequelize");

const requestSession = async (title, category, description, senderId, receiverId, tags, duration, senderWant, creditExchange, startTime, topic, exchangeTopic) => {
    try{
        if (
          !title ||
          !category ||
          !description ||
          !tags ||
          !duration ||
          !senderWant
        ) {
          throw new Error("All fields are required");
        }
        if(!senderId) senderId = null;
        if(!receiverId) receiverId = null;
        if(!creditExchange) creditExchange = null;
        if(!startTime) startTime = null;
        if(!topic) topic = null;
        if(!exchangeTopic) exchangeTopic = null;
        if (!senderWant) inExchange = null;
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
          senderWant,
          creditExchange,
          startTime,
          topic,
          exchangeTopic,
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
          senderWant: newSession.senderWant,
          creditExchange: newSession.creditExchange,
          startTime: newSession.startTime,
          topic: newSession.topic,
          exchangeTopic: newSession.exchangeTopic,
        };
    }catch(error){
        throw new Error(error.message);
    }
}

const singleUserSession = async (userId) => {
    try{
        const sessions = await Session.findAll({
            where: {
                [Op.or]: [
                    { senderId: userId },
                    { receiverId: userId }
                ]
            }
        });
        return sessions;
    }catch(error){
        throw new Error(error.message);
    }
}

const availableSessions = async () => {
    try{
        const sessions = await Session.findAll({
            where: {
                status: "pending"
            }
        });

        return sessions;
    }catch(error){
        throw new Error(error.message);
    }
}

const changeStatus = async (sessionId, status) => {
    try{
        const session = await Session.findByPk(sessionId);
        if(!session) throw new Error("Session not found");
        session.status = status;
        await session.save();
        return session;
    }catch(error){
        throw new Error(error.message);
    }
}


module.exports = {
    requestSession,
    singleUserSession,
    availableSessions,
    changeStatus
}
const Session = require("../models/Session");
const User = require("../models/User");
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
  try {
    const sessions = await Session.findAll({
      where: {
        status: "pending",
      },
    });

    const enrichedSessions = [];

    for (const session of sessions) {
      const user = await User.findOne({
        where: { id: session.senderId },
        attributes: ["fullName"],
      });

      enrichedSessions.push({
        id: session.id,
        title: session.title,
        category: session.category,
        description: session.description,
        senderId: session.senderId,
        receiverId: session.receiverId,
        tags: session.tags,
        duration: session.duration,
        senderWant: session.senderWant,
        creditExchange: session.creditExchange,
        startTime: session.startTime,
        topic: session.topic,
        exchangeTopic: session.exchangeTopic,
        senderName: user ? user.fullName : null,
        status: session.status,
      })
    }

    return enrichedSessions;
  } catch (error) {
    throw new Error(error.message);
  }
};


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

const acceptSession = async (sessionId, receiverId) => {
    try{
        const session = await Session.findByPk(sessionId);
        if(!session) throw new Error("Session not found");
        session.receiverId = receiverId;
        session.status = "accepted";
        await session.save();
        return session;
    }catch(error){
        throw new Error(error.message);
    }
}

const acceptedSessionsByUser = async (userId) => {
    try{
        const sessions = await Session.findAll({
            where: {
                [Op.or]: [
                    { senderId: userId },
                    { receiverId: userId }
                ],
                status: "accepted"
            }
        });

        const finalSessions = [];

        for(const session of sessions){
            const sender = await User.findOne({
                where: { id: session.senderId },
                attributes: ["fullName"]
            });
            const receiver = await User.findOne({
                where: { id: session.receiverId },
                attributes: ["fullName"]
            });
            finalSessions.push({
                id: session.id,
                title: session.title,
                category: session.category,
                description: session.description,
                senderId: session.senderId,
                receiverId: session.receiverId,
                tags: session.tags,
                duration: session.duration,
                senderWant: session.senderWant,
                creditExchange: session.creditExchange,
                startTime: session.startTime,
                topic: session.topic,
                exchangeTopic: session.exchangeTopic,
                senderName: sender ? sender.fullName : null,
                receiverName: receiver ? receiver.fullName : null,
                status: session.status,
            });
        }
        return finalSessions;
    }catch(error){
        throw new Error(error.message);
    }
}


module.exports = {
  requestSession,
  singleUserSession,
  availableSessions,
  changeStatus,
  acceptSession,
  acceptedSessionsByUser,
};
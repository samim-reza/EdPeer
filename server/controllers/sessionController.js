const { requestSession, singleUserSession, availableSessions, changeStatus, acceptSession, acceptedSessionsByUser } = require("../services/sessionService");

const createSession = async (req, res) => {
    const {
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
    } = req.body;

    console.log(req.body);

    try{
        const newSession = await requestSession(
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

const getSingleUserSession = async (req, res) => {
    const { id } = req.params;

    try {
        const sessions = await singleUserSession(id);
        res.status(200).json({
            message: "Session retrieved successfully",
            data: sessions,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}

const getAvailableSessions = async (req, res) => {
    try{
        const sessions = await availableSessions();
        res.status(200).json({
            message: "Available sessions retrieved successfully",
            data: sessions,
        });
    }catch(error){
        res.status(500).json({
            message: error.message,
        });
    }
}

const putSessionStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const session = await changeStatus(id, status);

        res.status(200).json({
            message: "Session status updated successfully",
            data: session,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}

const acceptSessionById = async (req, res) => {
    const {id} = req.params;
    const {receiverId} = req.body;
    try{
        const session = await acceptSession(id, receiverId);
        res.status(200).json({
            message: "Session accepted successfully",
            data: session,
        });
    }catch(error){
        res.status(500).json({
            message: error.message,
        });
    }
}

const getAcceptedSessionsByUser = async (req, res) => {
    const {userId} = req.params;

    try{
        const sessions = await acceptedSessionsByUser(userId);
        res.status(200).json({
            message: "Accepted sessions retrieved successfully",
            data: sessions,
        });
    }catch(error){
        res.status(500).json({
            message: error.message,
        });
    }
}

module.exports = {
  createSession,
  getSingleUserSession,
  getAvailableSessions,
  putSessionStatus,
  acceptSessionById,
  getAcceptedSessionsByUser,
};
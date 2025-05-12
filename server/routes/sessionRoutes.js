const express = require('express');
const { createSession, getSingleUserSession, getAvailableSessions, putSessionStatus, acceptSessionById, getAcceptedSessionsByUser } = require('../controllers/sessionController');
const router = express.Router();

router.post("/createSession", createSession);
router.get("/getSingleUserSession/:id", getSingleUserSession);
router.get("/getAvailableSessions/", getAvailableSessions);
router.put("/changeStatus/:id", putSessionStatus);
router.put("/acceptSession/:id", acceptSessionById);
router.get("/getAcceptedSessions/:userId", getAcceptedSessionsByUser);

module.exports = router;
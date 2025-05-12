const express = require('express');
const { createSession, getSingleUserSession, getAvailableSessions, putSessionStatus } = require('../controllers/sessionController');
const router = express.Router();

router.post("/createSession", createSession);
router.get("/getSingleUserSession/:id", getSingleUserSession);
router.get("/getAvailableSessions/", getAvailableSessions);
router.put("/changeStatus/:id", putSessionStatus);

module.exports = router;
// routes/session.js
const express = require("express");
const authenticate = require("./auth");
const pool = require("../config/database");
const router = express.Router();

// Create new session request
router.post("/create", authenticate, async (req, res) => {
  try {
    const { topic, description, urgency, duration, tags } = req.body;
    const studentId = req.userId;
    
    // Calculate cost based on urgency
    const costMap = { standard: 10, priority: 20, urgent: 30 };
    const cost = costMap[urgency] || 10;

    // Create session
    const [result] = await pool.query(
      `INSERT INTO sessions 
       (student_id, topic, duration, cost, status, created_at)
       VALUES (?, ?, ?, ?, 'pending', NOW())`,
      [studentId, topic, duration, cost]
    );

    // Store tags (assuming tags table exists)
    for (const tag of tags) {
      await pool.query(
        `INSERT INTO session_tags (session_id, tag)
         VALUES (?, ?)`,
        [result.insertId, tag]
      );
    }

    res.status(201).json({ 
      message: "Session request created",
      sessionId: result.insertId
    });
    
  } catch (error) {
    console.error("Session creation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get active sessions
router.get("/active", authenticate, async (req, res) => {
  try {
    const [sessions] = await pool.query(
      `SELECT s.id, s.topic, s.duration, s.cost, s.status, s.created_at,
       u.full_name AS tutor_name
       FROM sessions s
       LEFT JOIN users u ON s.tutor_id = u.id
       WHERE (s.student_id = ? OR s.tutor_id = ?)
       AND s.status IN ('active', 'pending')
       ORDER BY s.created_at DESC`,
      [req.userId, req.userId]
    );

    res.json(sessions);
    
  } catch (error) {
    console.error("Active sessions error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get available sessions for tutors
router.get("/available", authenticate, async (req, res) => {
  try {
    const [sessions] = await pool.query(
      `SELECT s.id, s.topic, s.duration, s.cost, s.created_at,
       u.full_name AS student_name, u.rating AS student_rating
       FROM sessions s
       JOIN users u ON s.student_id = u.id
       WHERE s.status = 'pending'
       AND s.tutor_id IS NULL
       ORDER BY s.created_at DESC`,
      [req.userId]
    );

    res.json(sessions);
    
  } catch (error) {
    console.error("Available sessions error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get potential matches for a session
router.get("/matches/:sessionId", authenticate, async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Get session tags
    const [tags] = await pool.query(
      `SELECT tag FROM session_tags
       WHERE session_id = ?`,
      [sessionId]
    );

    // Get matching tutors
    const [tutors] = await pool.query(
      `SELECT u.id, u.full_name, u.rating,
       COUNT(s.id) AS total_sessions,
       AVG(r.rating) AS avg_rating,
       (SELECT AVG(TIMESTAMPDIFF(MINUTE, created_at, NOW())) 
         AS avg_response_time
       FROM users u
       LEFT JOIN sessions s ON u.id = s.tutor_id
       LEFT JOIN ratings r ON s.id = r.session_id
       WHERE JSON_CONTAINS(u.expertise, JSON_ARRAY(?))
       GROUP BY u.id
       ORDER BY avg_rating DESC
       LIMIT 10`,
      [tags.map(t => t.tag)]
    );

    res.json(tutors.map(t => ({
      ...t,
      avg_response_time: `${Math.round(t.avg_response_time)}m`,
      avg_rating: t.avg_rating?.toFixed(1) || '4.5'
    })));
    
  } catch (error) {
    console.error("Match error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Accept session request (for tutors)
router.put("/accept/:sessionId", authenticate, async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    await pool.query(
      `UPDATE sessions SET
       tutor_id = ?,
       status = 'active'
       WHERE id = ? AND status = 'pending'`,
      [req.userId, sessionId]
    );

    res.json({ message: "Session accepted successfully" });
    
  } catch (error) {
    console.error("Accept session error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
const express = require("express");
const authenticate = require("./auth");
const pool = require("./config/database");
const router = express.Router();

// Get dashboard summary
router.get("/summary", authenticate, async (req, res) => {
  try {
    const userId = req.userId;

    // Get user stats
    const [user] = await pool.query(
      "SELECT credits, rating FROM users WHERE id = ?",
      [userId]
    );

    // Get session counts
    const [activeSessions] = await pool.query(
      `SELECT COUNT(*) AS count FROM sessions 
            WHERE (tutor_id = ? OR student_id = ?) 
            AND status = 'active'`,
      [userId, userId]
    );

    const [completedSessions] = await pool.query(
      `SELECT COUNT(*) AS count FROM sessions 
            WHERE (tutor_id = ? OR student_id = ?) 
            AND status = 'completed'`,
      [userId, userId]
    );

    res.json({
      credits: user[0].credits,
      rating: user[0].rating,
      activeSessions: activeSessions[0].count,
      completedSessions: completedSessions[0].count,
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get recent activity
router.get("/activity", authenticate, async (req, res) => {
  try {
    const [activity] = await pool.query(
      `SELECT s.id, s.topic, s.status, s.created_at, 
            u1.full_name AS tutor_name, 
            u2.full_name AS student_name
            FROM sessions s
            LEFT JOIN users u1 ON s.tutor_id = u1.id
            LEFT JOIN users u2 ON s.student_id = u2.id
            WHERE s.tutor_id = ? OR s.student_id = ?
            ORDER BY s.created_at DESC
            LIMIT 5`,
      [req.userId, req.userId]
    );

    res.json(activity);
  } catch (error) {
    console.error("Activity fetch error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get achievements
router.get("/achievements", authenticate, async (req, res) => {
  try {
    const [achievements] = await pool.query(
      `SELECT * FROM achievements
            WHERE user_id = ?`,
      [req.userId]
    );

    res.json(achievements);
  } catch (error) {
    console.error("Achievements fetch error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get notifications
router.get("/notifications", authenticate, async (req, res) => {
  try {
    const [notifications] = await pool.query(
      `SELECT * FROM notifications
            WHERE user_id = ?
            ORDER BY created_at DESC
            LIMIT 10`,
      [req.userId]
    );

    res.json(notifications);
  } catch (error) {
    console.error("Notifications fetch error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

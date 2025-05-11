const express = require("express");
const authenticate = require("./auth");
const pool = require("./config/database");
const bcrypt = require("bcrypt");
const router = express.Router();

// Get complete profile data
router.get("/", authenticate, async (req, res) => {
  try {
    const [user] = await pool.query(
      `SELECT 
        full_name,
        email,
        bio,
        expertise,
        credits,
        rating,
        date_of_birth,
        mobile_number,
        country
       FROM users WHERE id = ?`,
      [req.userId]
    );

    const [sessions] = await pool.query(
      "SELECT COUNT(*) AS total_sessions FROM sessions WHERE tutor_id = ? OR student_id = ?",
      [req.userId, req.userId]
    );

    res.json({
      ...user[0],
      expertise: JSON.parse(user[0].expertise || '[]'), // Convert text to array
      totalSessions: sessions[0].total_sessions
    });
    
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update personal information
router.put("/personal", authenticate, async (req, res) => {
  try {
    const { full_name, bio, date_of_birth, mobile_number, country } = req.body;
    
    await pool.query(
      `UPDATE users SET 
        full_name = ?,
        bio = ?,
        date_of_birth = ?,
        mobile_number = ?,
        country = ?
       WHERE id = ?`,
      [full_name, bio, date_of_birth, mobile_number, country, req.userId]
    );

    res.json({ message: "Profile updated successfully" });
    
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Expertise management
router.put("/expertise", authenticate, async (req, res) => {
  try {
    const { expertise } = req.body;
    
    // Validate expertise array
    if (!Array.isArray(expertise)) {
      return res.status(400).json({ error: "Invalid expertise format" });
    }

    await pool.query(
      "UPDATE users SET expertise = ? WHERE id = ?",
      [JSON.stringify(expertise), req.userId] // Store as JSON string
    );

    res.json({ message: "Expertise updated successfully" });
    
  } catch (error) {
    console.error("Expertise update error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Session history (updated to match your sessions table)
router.get("/sessions", authenticate, async (req, res) => {
  try {
    const [sessions] = await pool.query(
      `SELECT 
        s.id,
        s.topic,
        s.duration,
        s.cost,
        s.status,
        s.created_at,
        r.rating,
        CASE
          WHEN s.tutor_id = ? THEN stu.full_name
          ELSE tut.full_name
        END AS other_user
      FROM sessions s
      LEFT JOIN users tut ON s.tutor_id = tut.id
      LEFT JOIN users stu ON s.student_id = stu.id
      LEFT JOIN ratings r ON s.id = r.session_id
      WHERE s.tutor_id = ? OR s.student_id = ?
      ORDER BY s.created_at DESC`,
      [req.userId, req.userId, req.userId]
    );

    res.json(sessions.map(session => ({
      ...session,
      duration: `${session.duration} mins`,
      cost: `${session.cost} credits`
    })));
    
  } catch (error) {
    console.error("Session history error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



module.exports = router;
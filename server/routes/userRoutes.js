const express = require('express');
const router = express.Router();
const {
  register,
  login,
  profileData,
  updateUserFromProfileTab,
  updatePassword,
  putExpertise,
} = require("../controllers/userController");

router.post('/register', register);
router.post("/login", login);
router.get("/profileData/:id", profileData);
router.put("/updateUserProfileTab/:id", updateUserFromProfileTab);
router.put("/updatePassword/:id", updatePassword);
router.put("/updateExpertise/:id", putExpertise);

module.exports = router;
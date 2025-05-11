const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
require('dotenv').config();

const registerUser = async ({
  email,
  password,
  full_name,
  address,
  date_of_birth,
  mobile_number,
  country,
  expertise,
}) => {
  try {
    if (!email || !password || !full_name) {
      throw new Error("Email, password and full name are required");
    }
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      fullName: full_name,
      address,
      dateOfBirth: date_of_birth,
      phone: mobile_number,
      country,
      expertise,
    });
    return {
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName,
      address: newUser.address,
      dateOfBirth: newUser.dateOfBirth,
      phone: newUser.phone,
      country: newUser.country,
      expertise: newUser.expertise,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
    registerUser
}
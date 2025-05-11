const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
require('dotenv').config();

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            address: user.address,
            dateOfBirth: user.dateOfBirth,
            phone: user.phone,
            country: user.country,
            expertise: user.expertise,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
}

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

const loginUser = async (email, password) => {
    try {
        if(!email) throw new Error("Email is required");
        if(!password) throw new Error("Password is required");

        const user = await User.findOne({
            where: {
                email,
            }
        });

        if(!user) throw new Error("User not found");

        const isPassValid = await bcrypt.compare(password, user.password);

        if(!isPassValid) throw new Error("Invalid Password");

        const token = generateToken(user);

        return {token, user};

    }catch(error) {
        throw new Error(error.message);
    }
}

module.exports = {
    registerUser,
    loginUser,
}
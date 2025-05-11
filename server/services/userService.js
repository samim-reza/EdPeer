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

const getProfileData = async (userId) => {
    try{
        const user = await User.findOne({
            where: {
                id: userId,
            }
        });

        if(!user) throw new Error("User not found");

        return {
            id: user.id,
            email: user.email,
            full_name: user.fullName,
            bio: user.bio,
            expertise: user.expertise,
            credit: user.balance,
            rating: user.rating || 0,
            mobile_number: user.phone,
            country: user.country,
            address: user.address,
            total_session: 0,
            date_of_birth: user.dateOfBirth,
        }

    }catch(error) {
        throw new Error(error.message);
    }
}

const updateUserDataFromProfileTab = async (id, full_name, bio, date_of_birth, mobile_number, country) => {
    try{
        const user = await User.findOne({
            where: {
                id,
            }
        });

        if(!user) throw new Error("User not found");

        const updatedUser = await user.update({
            fullName: full_name,
            bio,
            dateOfBirth: date_of_birth,
            phone: mobile_number,
            country
        });

        return {
            id: updatedUser.id,
            email: updatedUser.email,
            full_name: updatedUser.fullName,
            bio: updatedUser.bio,
            expertise: updatedUser.expertise,
            credit: updatedUser.balance,
            rating: updatedUser.rating || 0,
            mobile_number: updatedUser.phone,
            country: updatedUser.country,
            address: updatedUser.address,
            total_session: 0,
            date_of_birth: updatedUser.dateOfBirth,
        }
    }catch(err){
        throw new Error(err.message);
    }
}

const changePassword = async (id, oldPassword, newPassword) => {
    try {
        const user = await User.findOne({
            where: {
                id,
            }
        });

        if(!user) throw new Error("User not found");

        const isPassValid = await bcrypt.compare(oldPassword, user.password);

        if(!isPassValid) throw new Error("Invalid Password");

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await user.update({
            password: hashedPassword,
        });

        return {
            id: user.id,
            email: user.email,
            full_name: user.fullName,
            bio: user.bio,
            expertise: user.expertise,
            credit: user.balance,
            rating: user.rating || 0,
            mobile_number: user.phone,
            country: user.country,
            address: user.address,
            total_session: 0,
            date_of_birth: user.dateOfBirth,
        }
    }catch(error) {
        throw new Error(error.message);
    }
}

const updateExpertise = async (id, expertise) => {
    try {
        const user = await User.findOne({
            where: {
                id,
            }
        });

        if(!user) throw new Error("User not found");

        await user.update({
            expertise,
        });
    }catch(error) {
        throw new Error(error.message);
    }
}

module.exports = {
  registerUser,
  loginUser,
  getProfileData,
  updateUserDataFromProfileTab,
  changePassword,
  updateExpertise,
};
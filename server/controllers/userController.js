const {
  registerUser,
  loginUser,
  getProfileData,
  updateUserDataFromProfileTab,
  changePassword,
  updateExpertise,
} = require("../services/userService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { Op } = require("sequelize");
require("dotenv").config();

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

const register = async (req, res) => {
    const { email, password, full_name, address, date_of_birth, mobile_number, country, expertise } = req.body;

    console.log(req.body);
    
    try {
        const newUser = await registerUser({
          email,
          password,
          full_name,
          address,
          date_of_birth,
          mobile_number,
          country,
          expertise,
        });

        const token = generateToken(newUser);

        res.status(201).json({
            message: "User registered successfully",
            data: {user: newUser, token},
        })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const login = async (req, res) => {
    const {email, password} = req.body;

    try{
        const {user, token} = await loginUser(email, password);

        res.status(200).json({
            message: "User logged in successfully",
            data: {user, token},
        })
    }catch(err){
        res.status(400).json({
            message: err.message
        })
    }
}

const profileData = async (req, res) => {
    const {id} = req.params;

    try{
        const user = await getProfileData(id);

        if(!user){
            return res.status(404).json({
                message: "User not found"
            })
        }

        return res.status(200).json({
            message: "User profile data",
            data: user
        })
    }catch(err){
        return res.status(500).json({
            message: err.message
        })
    }
}

const updateUserFromProfileTab = async (req, res) => {
    const {id} = req.params;
    const {email, full_name, address, date_of_birth, mobile_number, country, expertise, bio} = req.body;

    try{
        const updatedUser = await updateUserDataFromProfileTab(
          id,
          full_name,
          bio,
          date_of_birth,
          mobile_number,
          country
        );

        return res.status(201).json({
            message: "User updated successfully",
            data: updatedUser,
        });
    }catch(err){
        return res.status(500).json({
            message: err.message
        })
    }
}

const updatePassword = async (req, res) => {
    const {id} = req.params;
    const {currentPassword, newPassword} = req.body;

    console.log(req.body);

    try{
        const user = await changePassword(id, currentPassword, newPassword);
        

        return res.status(201).json({
            message: "Password updated successfully",
            data: user,
        })
    }catch(err){
        return res.status(500).json({
            message: err.message
        })
    }

}

const putExpertise = async (req, res) => {
    const {id} = req.params;
    const {expertise} = req.body;

    try {
        const updated = await updateExpertise(id, expertise);

        return res.status(200).json({
            message: "Expertise updated successfully",
            data: updated,
        });
    }catch(err){
        return res.status(500).json({
            message: err.message
        })
    }
}

module.exports = {
  register,
  login,
  profileData,
  updateUserFromProfileTab,
  updatePassword,
  putExpertise,
};
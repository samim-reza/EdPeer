const {registerUser, loginUser} = require("../services/userService");
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

module.exports = {
    register,
    login
}
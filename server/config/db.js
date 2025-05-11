const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
    pool: {
      max: 80, // Allow up to 50 concurrent Sequelize connections
      min: 10, // Keep at least 10 connections open
      acquire: 10000, // Wait 30s before failing a connection request
      idle: 5000, // Close idle connections after 5s
    },
    dialectOptions: {
      connectTimeout: 60000,
    },
  }
);

module.exports = sequelize;

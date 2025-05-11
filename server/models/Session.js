const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Session = sequelize.define("Session", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    senderId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    receiverId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    senderWant: {
        type: DataTypes.ENUM("Teach", "Learn"),
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM("pending", "running", "completed"),
        allowNull: false,
        defaultValue: "pending"
    },
    inExchange: {
        type: DataTypes.ENUM("credit", "learning"),
        allowNull: false,
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    startTime: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    creditExchange: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    topic: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    exchangeTopic: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    tags: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
}, {
    timestamps: true,
});

module.exports = Session;

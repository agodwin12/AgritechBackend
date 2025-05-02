const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ForumMessage = sequelize.define('ForumMessage', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    replies: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    }
}, {
    tableName: 'forum_messages',
    timestamps: true,
});

module.exports = ForumMessage;

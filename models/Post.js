const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Post = sequelize.define('Post', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    likes_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    }
}, {
    tableName: 'posts',
    timestamps: true,
});

module.exports = Post;

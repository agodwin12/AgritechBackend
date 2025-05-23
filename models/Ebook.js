const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const EbookCategory = require('./EbookCategory');

const Ebook = sequelize.define('Ebook', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
    },
    price: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    file_url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cover_image: {
        type: DataTypes.STRING,
    },
    is_approved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

// Associations
User.hasMany(Ebook, { foreignKey: 'author_id' });
Ebook.belongsTo(User, { foreignKey: 'author_id' });

EbookCategory.hasMany(Ebook, { foreignKey: 'category_id' });
Ebook.belongsTo(EbookCategory, { foreignKey: 'category_id' });

module.exports = Ebook;

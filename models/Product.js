const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const SubCategory = require('./SubCategory');

const Product = sequelize.define('Product', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    imageUrl: {
        type: DataTypes.TEXT,
    },
    market: {
        type: DataTypes.STRING,
    },
    isFeatured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    organic: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    inStock: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    dateAvailable: {
        type: DataTypes.DATEONLY,
    },
    rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
}, {
    tableName: 'products',
    timestamps: true,
});

// Relationships
User.hasMany(Product, { foreignKey: 'seller_id' });
Product.belongsTo(User, { foreignKey: 'seller_id' });

SubCategory.hasMany(Product, { foreignKey: 'sub_category_id' });
Product.belongsTo(SubCategory, { foreignKey: 'sub_category_id' });

module.exports = Product;

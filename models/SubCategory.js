const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Category = require('./Category');

const SubCategory = sequelize.define('SubCategory', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    }
}, {
    tableName: 'sub_categories',
    timestamps: true,
});

// Relation
Category.hasMany(SubCategory, { foreignKey: 'category_id' });
SubCategory.belongsTo(Category, { foreignKey: 'category_id' });

module.exports = SubCategory;

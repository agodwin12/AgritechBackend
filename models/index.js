const sequelize = require('../config/db');

const User = require('./User');
const Category = require('./Category');
const SubCategory = require('./SubCategory');
const Product = require('./Product');

module.exports = {
    sequelize,
    User,
    Category,
    SubCategory,
    Product
};

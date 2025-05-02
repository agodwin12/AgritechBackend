// models/index.js - Updated to use your existing config
const sequelize = require('../config/db');

// Import models
const User = require('./User');
const Category = require('./Category');
const SubCategory = require('./SubCategory');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Cart = require('./Cart');
const ForumMessage = require('./ForumMessage');

// Category-SubCategory relationship (one-to-many)
Category.hasMany(SubCategory, { foreignKey: 'category_id' });
SubCategory.belongsTo(Category, { foreignKey: 'category_id' });

// SubCategory-Product relationship (one-to-many)
SubCategory.hasMany(Product);
Product.belongsTo(SubCategory);

// Category-Product relationship (through SubCategory)
Category.hasMany(Product);
Product.belongsTo(Category);

// User-Order relationship (one-to-many)
User.hasMany(Order);
Order.belongsTo(User);

// Order-OrderItem relationship (one-to-many)
Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);

// Product-OrderItem relationship (one-to-many)
Product.hasMany(OrderItem);
OrderItem.belongsTo(Product);

// User-Cart relationship (one-to-many)
User.hasMany(Cart);
Cart.belongsTo(User);

// Product-Cart relationship (one-to-many)
Product.hasMany(Cart);
Cart.belongsTo(Product);

//forum associations
User.hasMany(ForumMessage, { foreignKey: 'user_id' });
ForumMessage.belongsTo(User, { foreignKey: 'user_id' });

// Export models and sequelize instance
module.exports = {
    sequelize, // Export the sequelize instance from your config
    User,
    Category,
    SubCategory,
    Product,
    Order,
    OrderItem,
    Cart,
    ForumMessage,
};
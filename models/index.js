const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = require('./User');
const Category = require('./Category');
const SubCategory = require('./SubCategory');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Cart = require('./Cart');
const ForumMessage = require('./ForumMessage');
const Review = require('./review')(sequelize, DataTypes);

// Associations
Category.hasMany(SubCategory, { foreignKey: 'category_id' });
SubCategory.belongsTo(Category, { foreignKey: 'category_id' });

SubCategory.hasMany(Product);
Product.belongsTo(SubCategory);

Category.hasMany(Product);
Product.belongsTo(Category);

User.hasMany(Order);
Order.belongsTo(User);

Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);

Product.hasMany(OrderItem);
OrderItem.belongsTo(Product);

User.hasMany(Cart);
Cart.belongsTo(User);

Product.hasMany(Cart);
Cart.belongsTo(Product);

User.hasMany(ForumMessage, { foreignKey: 'user_id' });
ForumMessage.belongsTo(User, { foreignKey: 'user_id' });

// ✅ Review associations
Product.hasMany(Review, { foreignKey: 'productId', onDelete: 'CASCADE' });
Review.belongsTo(Product, { foreignKey: 'productId' });

User.hasMany(Review, { foreignKey: 'user_id', as: 'reviews' }); // ✅ CORRECT
Review.belongsTo(User, { foreignKey: 'user_id', as: 'user' });  // optional but consistent


// Product <-> User (seller)
Product.belongsTo(User, { foreignKey: 'seller_id', as: 'seller' });
User.hasMany(Product, { foreignKey: 'seller_id', as: 'products' });




module.exports = {
    sequelize,
    User,
    Category,
    SubCategory,
    Product,
    Order,
    OrderItem,
    Cart,
    ForumMessage,
    Review,
};

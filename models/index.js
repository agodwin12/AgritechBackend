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
const EbookCategory = require('./EbookCategory');
const Ebook = require('./Ebook');
const EbookOrder = require('./EbookOrder');
const VideoCategory = require('./VideoCategory');
const VideoTip = require('./VideoTip');
const WebinarRequest = require('./WebinarRequest')(sequelize, DataTypes);
const Webinar = require('./Webinar')(sequelize, DataTypes);
const WebinarAttendee = require('./WebinarAttendee')(sequelize, DataTypes);
const WebinarQuestion = require('./WebinarQuestion')(sequelize, DataTypes);



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


// ✅ EBOOK ASSOCIATIONS
User.hasMany(Ebook, { foreignKey: 'author_id' });
Ebook.belongsTo(User, { foreignKey: 'author_id' });

EbookCategory.hasMany(Ebook, { foreignKey: 'category_id' });
Ebook.belongsTo(EbookCategory, { foreignKey: 'category_id' });

User.hasMany(EbookOrder, { foreignKey: 'user_id' });
EbookOrder.belongsTo(User, { foreignKey: 'user_id' });

Ebook.hasMany(EbookOrder, { foreignKey: 'ebook_id' });
EbookOrder.belongsTo(Ebook, { foreignKey: 'ebook_id' });

// ✅ VIDEO ASSOCIATIONS
User.hasMany(VideoTip, { foreignKey: 'uploaded_by' });
VideoTip.belongsTo(User, { foreignKey: 'uploaded_by' });

VideoCategory.hasMany(VideoTip, { foreignKey: 'category_id' });
VideoTip.belongsTo(VideoCategory, { foreignKey: 'category_id' });

// === Webinar Relationships ===

// WebinarRequest belongsTo User
User.hasMany(WebinarRequest, { foreignKey: 'requested_by_user_id' });
WebinarRequest.belongsTo(User, { foreignKey: 'requested_by_user_id', as: 'requestedBy' });

// Webinar belongsTo User (host)
User.hasMany(Webinar, { foreignKey: 'host_user_id' });
Webinar.belongsTo(User, { foreignKey: 'host_user_id', as: 'host' });

// Webinar optionally links to an approved WebinarRequest
WebinarRequest.hasOne(Webinar, { foreignKey: 'approved_request_id' });
Webinar.belongsTo(WebinarRequest, { foreignKey: 'approved_request_id', as: 'fromRequest' });

// WebinarAttendee belongsTo Webinar & User
User.hasMany(WebinarAttendee, { foreignKey: 'user_id' });
WebinarAttendee.belongsTo(User, { foreignKey: 'user_id' });

Webinar.hasMany(WebinarAttendee, { foreignKey: 'webinar_id' });
WebinarAttendee.belongsTo(Webinar, { foreignKey: 'webinar_id' });

// WebinarQuestion belongsTo Webinar & User
User.hasMany(WebinarQuestion, { foreignKey: 'user_id' });
WebinarQuestion.belongsTo(User, { foreignKey: 'user_id' });

Webinar.hasMany(WebinarQuestion, { foreignKey: 'webinar_id' });
WebinarQuestion.belongsTo(Webinar, { foreignKey: 'webinar_id' });





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
    EbookCategory,
    Ebook,
    EbookOrder,
    VideoCategory,
    VideoTip,
    WebinarRequest,
    Webinar,
    WebinarAttendee,
    WebinarQuestion,
};

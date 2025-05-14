const ForumMessage = require('../models/ForumMessage');
const User = require('../models/user');
const { Op } = require('sequelize');

ForumMessage.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// ✅ Get all messages with user details
const getAllMessages = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const search = req.query.search || '';

        const messages = await ForumMessage.findAll({
            where: search ? { text: { [Op.like]: `%${search}%` } } : {},
            include: {
                model: User,
                as: 'user',
                attributes: ['id', 'full_name', 'profile_image']
            },
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({ messages });
    } catch (err) {
        console.error("❌ Error fetching messages:", err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ✅ Post a new message
const postMessage = async (req, res) => {
    try {
        const { text } = req.body;
        let image_url = null;

        if (req.file) {
            image_url = `/uploads/${req.file.filename}`;
        } else if (req.body.image_url) {
            image_url = req.body.image_url;
        }

        if (!text && !image_url) {
            return res.status(400).json({ message: 'Text or image is required' });
        }

        const newMessage = await ForumMessage.create({
            user_id: req.user.id,
            text,
            image_url
        });

        res.status(201).json({ message: 'Message posted', data: newMessage });
    } catch (err) {
        console.error("❌ Error posting message:", err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ✅ Delete a message
const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await ForumMessage.findByPk(id);

        if (!message) return res.status(404).json({ message: 'Message not found' });

        await message.destroy();
        res.status(200).json({ message: 'Message deleted' });
    } catch (err) {
        console.error("❌ Error deleting message:", err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAllMessages,
    postMessage,
    deleteMessage,
};

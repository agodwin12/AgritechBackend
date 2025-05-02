const { ForumMessage, User } = require('../models');
const path = require('path');

// GET all messages
exports.getMessages = async (req, res) => {
    try {
        const messages = await ForumMessage.findAll({
            order: [['createdAt', 'ASC']],
            include: {
                model: User,
                attributes: ['id', 'full_name', 'profile_image']
            }
        });
        res.json({ success: true, data: messages });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// POST a message
exports.postMessage = async (req, res) => {
    try {
        const { user_id, text } = req.body;

        let image_url = null;
        if (req.file) {
            image_url = `/uploads/${req.file.filename}`;
        }

        const newMessage = await ForumMessage.create({
            user_id,
            text,
            image_url
        });

        const messageWithUser = await ForumMessage.findByPk(newMessage.id, {
            include: {
                model: User,
                attributes: ['id', 'full_name', 'profile_image']
            }
        });

        res.status(201).json({ success: true, data: messageWithUser });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to post message', error });
    }
};

// LIKE a message
exports.likeMessage = async (req, res) => {
    try {
        const message = await ForumMessage.findByPk(req.params.id);
        if (!message) return res.status(404).json({ success: false, message: 'Message not found' });

        message.likes += 1;
        await message.save();

        res.json({ success: true, data: message });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

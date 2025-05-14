const { ForumMessage, User } = require('../models');
const path = require('path');

// GET all messages
exports.getMessages = async (req, res) => {
    console.log('\n📥 [GET] /api/forum/messages called');
    try {
        console.log('🔄 Fetching all forum messages with user data...');
        const messages = await ForumMessage.findAll({
            order: [['createdAt', 'DESC']],
            include: {
                model: User,
                attributes: ['id', 'full_name', 'profile_image']
            }
        });

        console.log(`✅ ${messages.length} message(s) retrieved.`);
        messages.forEach((msg, i) => {
            console.log(`📩 [${i + 1}] Message ID ${msg.id} from User ${msg.user_id}:`, {
                text: msg.text,
                image: msg.image_url,
                likes: msg.likes,
                createdAt: msg.createdAt
            });
        });

        res.json({ success: true, data: messages });
    } catch (error) {
        console.error('❌ Error in getMessages:', error);
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// POST a new message
exports.postMessage = async (req, res) => {
    console.log('\n✉️ [POST] /api/forum/messages called');
    try {
        const { user_id, text } = req.body;
        console.log('📦 Received form data:', {
            user_id,
            text,
            hasFile: !!req.file,
            file: req.file ? req.file.originalname : null
        });

        let image_url = null;
        if (req.file) {
            image_url = `/uploads/${req.file.filename}`;
            console.log('🖼️ Image will be saved as:', image_url);
        }

        console.log('🛠️ Creating new forum message...');
        const newMessage = await ForumMessage.create({
            user_id,
            text,
            image_url
        });

        console.log('✅ Message saved to DB with ID:', newMessage.id);

        console.log('🔁 Fetching new message with user info...');
        const messageWithUser = await ForumMessage.findByPk(newMessage.id, {
            include: {
                model: User,
                attributes: ['id', 'full_name', 'profile_image']
            }
        });

        console.log('📤 Responding with message:');
        console.log({
            id: messageWithUser.id,
            user: messageWithUser.User.full_name,
            text: messageWithUser.text,
            image_url: messageWithUser.image_url,
            createdAt: messageWithUser.createdAt
        });

        res.status(201).json({ success: true, data: messageWithUser });
    } catch (error) {
        console.error('❌ Error in postMessage:', error);
        res.status(500).json({ success: false, message: 'Failed to post message', error });
    }
};

// LIKE a message
exports.likeMessage = async (req, res) => {
    console.log(`\n❤️ [POST] /api/forum/messages/${req.params.id}/like called`);
    try {
        const { id } = req.params;
        console.log(`🔎 Finding message with ID: ${id}...`);
        const message = await ForumMessage.findByPk(id);

        if (!message) {
            console.log('❌ Message not found.');
            return res.status(404).json({ success: false, message: 'Message not found' });
        }

        console.log(`👍 Current likes: ${message.likes}`);
        message.likes += 1;
        await message.save();
        console.log(`✅ Likes incremented to: ${message.likes}`);

        res.json({ success: true, data: message });
    } catch (error) {
        console.error('❌ Error in likeMessage:', error);
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

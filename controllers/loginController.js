const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const User = require('../models/user');

const loginUser = async (req, res) => {
    try {
        const { email, phone, password } = req.body;
        const identifier = email || phone;

        console.log("🟢 Login attempt with identifier:", identifier);

        if (!identifier || !password) {
            return res.status(400).json({ message: 'Email/Phone and password are required' });
        }

        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { email: identifier },
                    { phone: identifier }
                ]
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                phone: user.phone,
                role: user.role
            },
            process.env.JWT_SECRET || 'yourSecretKey',
            { expiresIn: '30d' } // Extended token lifespan
        );

        const { password: _, ...safeUserData } = user.toJSON();

        return res.status(200).json({
            message: 'Login successful',
            token,
            user: safeUserData
        });

    } catch (error) {
        console.error("🔥 Error during login:", error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const googleLogin = async (req, res) => {
    try {
        const { email, full_name, profile_image } = req.body;

        if (!email || !full_name) {
            return res.status(400).json({ message: 'Missing email or name' });
        }

        let user = await User.findOne({ where: { email } });

        if (!user) {
            user = await User.create({
                email,
                full_name,
                phone: '0000000000', // dummy phone (since it's required)
                password: 'google_oauth_login', // dummy password (not used)
                profile_image,
                role: 'user',
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET || 'yourSecretKey',
            { expiresIn: '30d' }
        );

        const { password, ...userSafe } = user.toJSON();

        return res.status(200).json({ token, user: userSafe });
    } catch (error) {
        console.error('🔥 Google login error:', error);
        return res.status(500).json({ message: 'Google login failed', error: error.message });
    }
};

module.exports = { loginUser, googleLogin };

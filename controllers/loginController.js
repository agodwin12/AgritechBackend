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
            console.log("❌ Missing identifier or password");
            return res.status(400).json({ message: 'Email/Phone and password are required' });
        }

        // Find user by email or phone
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { email: identifier },
                    { phone: identifier }
                ]
            }
        });

        if (!user) {
            console.log("❌ User not found");
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            console.log("❌ Incorrect password");
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                phone: user.phone
            },
            process.env.JWT_SECRET || 'yourSecretKey',
            { expiresIn: '7d' }
        );

        console.log("✅ Login successful, token generated");

        // Exclude password
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

module.exports = { loginUser };

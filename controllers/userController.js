const bcrypt = require('bcrypt');
const User = require('../models/user');

const registerUser = async (req, res) => {
    try {
        const {
            full_name,
            email,
            phone,
            password,
            address,
            date_of_birth
        } = req.body;

        if (!full_name || !email || !phone || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            full_name,
            email,
            phone,
            password: hashedPassword,
            address,
            date_of_birth,
            profile_image: req.file ? req.file.filename : null, // Save filename only
        });

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'Email or phone already exists' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { registerUser };

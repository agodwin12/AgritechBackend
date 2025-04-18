const User = require('../models/user');

const getMyProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findByPk(userId, {
            attributes: {
                exclude: ['password'] // Don't expose password
            }
        });

        if (!user) {
            console.log("❌ User not found for ID:", userId);
            return res.status(404).json({ message: 'User not found' });
        }

        console.log("✅ Fetched profile for user ID:", userId);
        return res.status(200).json({
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            date_of_birth: user.date_of_birth,
            profile_image: user.profile_image,
            created_at: user.createdAt
        });
    } catch (error) {
        console.error("❌ Error fetching user profile:", error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getMyProfile };

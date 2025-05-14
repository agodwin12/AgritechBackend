const { User, Product, Review } = require('../models');

// ✅ Get profile of the logged-in user (via token)
const getMyProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: Product,
                    as: 'products',
                },
                {
                    model: Review,
                    as: 'reviews',
                    attributes: ['rating']
                }
            ]
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const averageRating = user.reviews?.length > 0
            ? user.reviews.reduce((acc, r) => acc + r.rating, 0) / user.reviews.length
            : 0;

        return res.status(200).json({
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            date_of_birth: user.date_of_birth,
            profile_image: user.profile_image,
            bio: user.bio,
            facebook: user.facebook,
            instagram: user.instagram,
            twitter: user.twitter,
            tiktok: user.tiktok,
            created_at: user.createdAt,
            average_rating: parseFloat(averageRating.toFixed(1)),
            products: user.products ?? []
        });
    } catch (error) {
        console.error("❌ Error fetching user profile:", error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ✅ Get profile of any user by userId (for public profile screen)
const getUserProfile = async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: Product,
                    as: 'products',
                },
                {
                    model: Review,
                    as: 'reviews',
                    attributes: ['rating']
                }
            ]
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const averageRating = user.reviews?.length > 0
            ? user.reviews.reduce((acc, r) => acc + r.rating, 0) / user.reviews.length
            : 0;

        return res.status(200).json({
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            date_of_birth: user.date_of_birth,
            profile_image: user.profile_image,
            bio: user.bio,
            facebook: user.facebook,
            instagram: user.instagram,
            twitter: user.twitter,
            tiktok: user.tiktok,
            created_at: user.createdAt,
            average_rating: parseFloat(averageRating.toFixed(1)),
            products: user.products ?? []
        });
    } catch (error) {
        console.error("❌ Error fetching user profile by ID:", error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const updateMyProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const allowedFields = [
            'full_name', 'phone', 'address', 'date_of_birth', 'bio',
            'facebook', 'instagram', 'twitter', 'tiktok', 'profile_image'
        ];

        const updates = {};
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        await User.update(updates, { where: { id: userId } });

        const updatedUser = await User.findByPk(userId, {
            attributes: { exclude: ['password'] },
        });

        return res.status(200).json({ message: 'Profile updated', user: updatedUser });
    } catch (error) {
        console.error('❌ Error updating profile:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};


module.exports = {
    getMyProfile,
    getUserProfile,
    updateMyProfile,
};

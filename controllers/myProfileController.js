const { User, Product, Review } = require('../models');

const BASE_URL = 'http://10.0.2.2:3000/'; // 🔁 Update as needed for production

const buildUserResponse = (user) => {
    const averageRating = user.reviews?.length > 0
        ? user.reviews.reduce((acc, r) => acc + r.rating, 0) / user.reviews.length
        : 0;

    return {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        date_of_birth: user.date_of_birth,
        profile_image: user.profile_image ? `${BASE_URL}${user.profile_image}` : null,
        bio: user.bio,
        facebook: user.facebook,
        instagram: user.instagram,
        twitter: user.twitter,
        tiktok: user.tiktok,
        created_at: user.createdAt,
        average_rating: parseFloat(averageRating.toFixed(1)),
        products: user.products ?? []
    };
};

// ✅ Get profile of the logged-in user
const getMyProfile = async (req, res) => {
    console.log("➡️ Entered getMyProfile function");

    try {
        const userId = req.user?.id;
        console.log("🔑 Extracted user ID from token:", userId);

        if (!userId) {
            console.log("⚠️ No user ID found in request");
            return res.status(401).json({ message: 'Unauthorized' });
        }

        console.log("🔍 Searching for user in database...");
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] },
            include: [
                { model: Product, as: 'products' },
                { model: Review, as: 'reviews', attributes: ['rating'] }
            ]
        });

        if (!user) {
            console.log("❌ User not found in database");
            return res.status(404).json({ message: 'User not found' });
        }

        console.log("✅ User found:", {
            id: user.id,
            full_name: user.full_name,
            profile_image: user.profile_image,
            productsCount: user.products?.length ?? 0,
            reviewsCount: user.reviews?.length ?? 0,
        });

        const responsePayload = buildUserResponse(user);
        console.log("📦 Response payload being sent:", responsePayload);

        return res.status(200).json(responsePayload);

    } catch (error) {
        console.error("❌ Error during getMyProfile execution:", error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// ✅ Get public profile of another user
const getUserProfile = async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] },
            include: [
                { model: Product, as: 'products' },
                { model: Review, as: 'reviews', attributes: ['rating'] }
            ]
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(buildUserResponse(user));

    } catch (error) {
        console.error("❌ Error fetching user profile by ID:", error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ✅ Update profile
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
            include: [
                { model: Product, as: 'products' },
                { model: Review, as: 'reviews', attributes: ['rating'] }
            ]
        });

        return res.status(200).json({ message: 'Profile updated', user: buildUserResponse(updatedUser) });

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

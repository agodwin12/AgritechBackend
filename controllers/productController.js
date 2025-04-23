const { Product, User, SubCategory, Category } = require('../models');

module.exports = {
    // 🔹 Create product
    async createProduct(req, res) {
        try {
            const {
                name,
                description,
                price,
                quantity,
                market,
                sub_category_id,
                seller_id,
                organic,
                dateAvailable
            } = req.body;

            const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

            if (!imageUrl) {
                return res.status(400).json({ success: false, message: 'Product image is required.' });
            }

            const product = await Product.create({
                name,
                description,
                price,
                quantity,
                market,
                sub_category_id,
                seller_id,
                organic,
                dateAvailable,
                imageUrl,
                inStock: quantity > 0
            });

            return res.status(201).json({ success: true, product });
        } catch (error) {
            console.error("❌ Product Upload Error:", error);
            return res.status(500).json({ success: false, message: 'Failed to create product', error: error.message });
        }
    },


    // 🔹 Get all products
    async getAllProducts(req, res) {
        try {
            const products = await Product.findAll({
                include: [
                    { model: User, attributes: ['full_name', 'email', 'phone'] },
                    {
                        model: SubCategory,
                        attributes: ['name'],
                        include: [{ model: Category, attributes: ['name'] }]
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            return res.status(200).json({ success: true, products });
        } catch (error) {
            console.error("❌ Fetch Products Error:", error);
            return res.status(500).json({ success: false, message: 'Failed to fetch products', error: error.message });
        }
    },

    // 🔹 Get featured products
    async getFeaturedProducts(req, res) {
        try {
            const products = await Product.findAll({
                where: { isFeatured: true },
                include: [
                    { model: User, attributes: ['full_name'] },
                    {
                        model: SubCategory,
                        include: [{ model: Category }]
                    }
                ]
            });

            return res.status(200).json({ success: true, products });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Failed to fetch featured products' });
        }
    },

    // 🔹 Toggle product as featured
    async toggleFeatured(req, res) {
        try {
            const product = await Product.findByPk(req.params.id);
            if (!product) return res.status(404).json({ message: 'Product not found' });

            product.isFeatured = !product.isFeatured;
            await product.save();

            return res.status(200).json({ success: true, product });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Failed to update product' });
        }
    }
};

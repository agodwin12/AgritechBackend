const { Product, Category, SubCategory } = require('../models');

const ProductController = {
    async getAllProducts(req, res) {
        console.log('📥 GET all active products');
        try {
            const products = await Product.findAll({
                where: { is_active: true },
                include: [
                    { model: Category },
                    { model: SubCategory }
                ]
            });
            console.log('✅ Products fetched:', products.length);
            return res.status(200).json(products);
        } catch (error) {
            console.error('❌ Error in getAllProducts:', error);
            return res.status(500).json({ error: error.message });
        }
    },

    async getFeaturedProducts(req, res) {
        console.log('📥 GET featured products');
        try {
            const products = await Product.findAll({
                where: {
                    is_active: true,
                    is_featured: true
                },
                include: [
                    { model: Category },
                    { model: SubCategory }
                ]
            });
            console.log('✅ Featured products fetched:', products.length);
            return res.status(200).json(products);
        } catch (error) {
            console.error('❌ Error in getFeaturedProducts:', error);
            return res.status(500).json({ error: error.message });
        }
    },

    async getProductById(req, res) {
        console.log('📥 GET product by ID:', req.params.id);
        try {
            const product = await Product.findByPk(req.params.id, {
                include: [
                    { model: Category },
                    { model: SubCategory }
                ]
            });
            if (!product) {
                console.warn('⚠️ Product not found:', req.params.id);
                return res.status(404).json({ message: 'Product not found' });
            }
            console.log('✅ Product found:', product.id);
            return res.status(200).json(product);
        } catch (error) {
            console.error('❌ Error in getProductById:', error);
            return res.status(500).json({ error: error.message });
        }
    },

    async getProductsByCategory(req, res) {
        console.log('📥 GET products by category ID:', req.params.categoryId);
        try {
            const products = await Product.findAll({
                where: {
                    CategoryId: req.params.categoryId,
                    is_active: true
                },
                include: [
                    { model: Category },
                    { model: SubCategory }
                ]
            });
            console.log(`✅ ${products.length} products found for category ${req.params.categoryId}`);
            return res.status(200).json(products);
        } catch (error) {
            console.error('❌ Error in getProductsByCategory:', error);
            return res.status(500).json({ error: error.message });
        }
    },

    async getProductsBySubCategory(req, res) {
        console.log('📥 GET products by subcategory ID:', req.params.subCategoryId);
        try {
            const products = await Product.findAll({
                where: {
                    SubCategoryId: req.params.subCategoryId,
                    is_active: true
                },
                include: [
                    { model: Category },
                    { model: SubCategory }
                ]
            });
            console.log(`✅ ${products.length} products found for subcategory ${req.params.subCategoryId}`);
            return res.status(200).json(products);
        } catch (error) {
            console.error('❌ Error in getProductsBySubCategory:', error);
            return res.status(500).json({ error: error.message });
        }
    },

    async createProduct(req, res) {
        console.log('📥 CREATE product with data:', req.body);
        try {
            const {
                name,
                description,
                price,
                stock,
                unit,
                categoryId,
                subCategoryId,
                isFeatured,
                sellerId
            } = req.body;

            // Parse image file paths
            const imageUrls = req.files?.map(file => `/uploads/${file.filename}`) || [];

            // Build product object
            const newProduct = {
                name,
                description,
                price: parseFloat(price),
                stock_quantity: parseInt(stock),
                unit,
                is_featured: isFeatured === 'true',
                is_active: true,
                images: imageUrls, // ✅ stored as real JSON array
                CategoryId: parseInt(categoryId),
                SubCategoryId: parseInt(subCategoryId),
                seller_id: parseInt(sellerId)
            };

            // Save to database
            const product = await Product.create(newProduct);

            console.log('✅ Product created:', product.id);
            return res.status(201).json(product);

        } catch (error) {
            console.error('❌ Error in createProduct:', error);
            return res.status(500).json({ error: error.message });
        }
    },



    async updateProduct(req, res) {
        console.log('📥 UPDATE product ID:', req.params.id, 'with data:', req.body);
        try {
            const [updated] = await Product.update(req.body, {
                where: { id: req.params.id }
            });
            if (updated) {
                const updatedProduct = await Product.findByPk(req.params.id);
                console.log('✅ Product updated:', updatedProduct.id);
                return res.status(200).json(updatedProduct);
            }
            console.warn('⚠️ Product not found to update:', req.params.id);
            return res.status(404).json({ message: 'Product not found' });
        } catch (error) {
            console.error('❌ Error in updateProduct:', error);
            return res.status(500).json({ error: error.message });
        }
    },

    async deleteProduct(req, res) {
        console.log('📥 DELETE product ID:', req.params.id);
        try {
            const deleted = await Product.destroy({
                where: { id: req.params.id }
            });
            if (deleted) {
                console.log('✅ Product deleted:', req.params.id);
                return res.status(204).send();
            }
            console.warn('⚠️ Product not found to delete:', req.params.id);
            return res.status(404).json({ message: 'Product not found' });
        } catch (error) {
            console.error('❌ Error in deleteProduct:', error);
            return res.status(500).json({ error: error.message });
        }
    }
};

module.exports = ProductController;

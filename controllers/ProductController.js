// controllers/ProductController.js
const { Product, Category, SubCategory } = require('../models');

const ProductController = {
    // Get all products
    async getAllProducts(req, res) {
        try {
            const products = await Product.findAll({
                where: { is_active: true },
                include: [
                    { model: Category },
                    { model: SubCategory }
                ]
            });
            return res.status(200).json(products);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // Get featured products
    async getFeaturedProducts(req, res) {
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
            return res.status(200).json(products);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // Get product by ID
    async getProductById(req, res) {
        try {
            const product = await Product.findByPk(req.params.id, {
                include: [
                    { model: Category },
                    { model: SubCategory }
                ]
            });
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            return res.status(200).json(product);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // Get products by category
    async getProductsByCategory(req, res) {
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
            return res.status(200).json(products);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // Get products by subcategory
    async getProductsBySubCategory(req, res) {
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
            return res.status(200).json(products);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // Create a new product
    async createProduct(req, res) {
        try {
            const product = await Product.create(req.body);
            return res.status(201).json(product);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // Update a product
    async updateProduct(req, res) {
        try {
            const [updated] = await Product.update(req.body, {
                where: { id: req.params.id }
            });
            if (updated) {
                const updatedProduct = await Product.findByPk(req.params.id);
                return res.status(200).json(updatedProduct);
            }
            return res.status(404).json({ message: 'Product not found' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // Delete a product
    async deleteProduct(req, res) {
        try {
            const deleted = await Product.destroy({
                where: { id: req.params.id }
            });
            if (deleted) {
                return res.status(204).send();
            }
            return res.status(404).json({ message: 'Product not found' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
};

module.exports = ProductController;
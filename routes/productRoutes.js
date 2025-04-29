// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', ProductController.getAllProducts);
router.get('/featured', ProductController.getFeaturedProducts);
router.get('/:id', ProductController.getProductById);
router.get('/category/:categoryId', ProductController.getProductsByCategory);
router.get('/subcategory/:subCategoryId', ProductController.getProductsBySubCategory);


module.exports = router;
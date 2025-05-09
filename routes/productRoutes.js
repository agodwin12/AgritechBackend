const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const { authenticate, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload'); // Assuming this exists

// Public GET routes
router.get('/', ProductController.getAllProducts);
router.get('/featured', ProductController.getFeaturedProducts);
router.get('/:id', ProductController.getProductById);
router.get('/category/:categoryId', ProductController.getProductsByCategory);
router.get('/subcategory/:subCategoryId', ProductController.getProductsBySubCategory);

// POST product with image
router.post('/', upload.array('images'), ProductController.createProduct);

module.exports = router;

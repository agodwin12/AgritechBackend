const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middleware/upload');

// Create a new product
router.post('/', productController.createProduct);

// Get all products
router.get('/', productController.getAllProducts);

// Get featured products
router.get('/featured', productController.getFeaturedProducts);

// Toggle product as featured
router.put('/:id/feature', productController.toggleFeatured);

router.post('/', upload.single('image'), productController.createProduct);

module.exports = router;

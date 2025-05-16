// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

// All order routes require authentication
router.use(authenticate);

// User routes
router.get('/', OrderController.getUserOrders);
router.get('/:id', OrderController.getOrderById);
router.post('/', OrderController.createOrder);
router.put('/:id/cancel', OrderController.cancelOrder);
// Admin routes
router.use(authenticate); // All routes below require login

router.get('/admin/orders', authorizeAdmin, OrderController.getAllOrders); // Admin only
router.put('/admin/orders/:id/status', authorizeAdmin, OrderController.updateOrderStatus);





module.exports = router;
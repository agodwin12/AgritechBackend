// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const { authenticate, isAdmin } = require('../middleware/auth');

// All order routes require authentication
router.use(authenticate);

// User routes
router.get('/', OrderController.getUserOrders);
router.get('/:id', OrderController.getOrderById);
router.post('/', OrderController.createOrder);
router.put('/:id/cancel', OrderController.cancelOrder);

// Admin routes
router.put('/:id/status', isAdmin, OrderController.updateOrderStatus);



module.exports = router;
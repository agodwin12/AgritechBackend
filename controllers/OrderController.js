// controllers/OrderController.js
const { Order, OrderItem, Cart, Product, User, Category, SubCategory, sequelize } = require('../models');
const { v4: uuidv4 } = require('uuid');

const OrderController = {

        //admins
    // controllers/OrderController.js
    async getAllOrders(req, res) {
        try {
            const orders = await Order.findAll({
                include: [
                    {
                        model: OrderItem,
                        include: [{ model: Product }],
                    },
                    {
                        model: User,
                        attributes: ['id', 'full_name', 'phone', 'email'], // include name & phone
                    },
                ],
                order: [['createdAt', 'DESC']],
            });

            return res.status(200).json(orders);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    ,

    // Get all orders for a user
    async getUserOrders(req, res) {
        try {
            const orders = await Order.findAll({
                where: { UserId: req.user.id },
                order: [['createdAt', 'DESC']]
            });
            return res.status(200).json(orders);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // Get order details
    async getOrderById(req, res) {
        try {
            const order = await Order.findOne({
                where: {
                    id: req.params.id,
                    UserId: req.user.id
                },
                include: [
                    {
                        model: OrderItem,
                        include: [
                            {
                                model: Product,
                                include: [
                                    { model: Category },
                                    { model: SubCategory }
                                ]
                            }
                        ]
                    }
                ]
            });

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            return res.status(200).json(order);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // Create a new order
    async createOrder(req, res) {
        const t = await sequelize.transaction();

        try {
            const { shipping_address, shipping_method, payment_method, notes } = req.body;

            // Get cart items
            const cartItems = await Cart.findAll({
                where: { UserId: req.user.id },
                include: [
                    {
                        model: Product,
                        include: [
                            { model: Category },
                            { model: SubCategory }
                        ]
                    }
                ],
                transaction: t
            });

            if (cartItems.length === 0) {
                await t.rollback();
                return res.status(400).json({ message: 'Cart is empty' });
            }

            // Calculate total
            let total_amount = 0;
            for (const item of cartItems) {
                total_amount += item.Product.price * item.quantity;
            }

            // Create order
            const order = await Order.create({
                order_number: `ORD-${uuidv4().substring(0, 8)}`,
                UserId: req.user.id,
                total_amount,
                shipping_address,
                shipping_method,
                payment_method,
                notes
            }, { transaction: t });

            // Create order items
            for (const item of cartItems) {
                await OrderItem.create({
                    OrderId: order.id,
                    ProductId: item.ProductId,
                    quantity: item.quantity,
                    price: item.Product.price,
                    subtotal: item.Product.price * item.quantity
                }, { transaction: t });

                // Update product stock
                const product = await Product.findByPk(item.ProductId, { transaction: t });
                product.stock_quantity -= item.quantity;
                await product.save({ transaction: t });
            }

            // Clear cart
            await Cart.destroy({
                where: { UserId: req.user.id },
                transaction: t
            });

            await t.commit();

            // Get complete order with items
            const completeOrder = await Order.findByPk(order.id, {
                include: [
                    {
                        model: OrderItem,
                        include: [
                            {
                                model: Product,
                                include: [
                                    { model: Category },
                                    { model: SubCategory }
                                ]
                            }
                        ]
                    }
                ]
            });

            return res.status(201).json(completeOrder);
        } catch (error) {
            await t.rollback();
            return res.status(500).json({ error: error.message });
        }
    },


// Update order status and/or payment status (admin only)
    async updateOrderStatus(req, res) {
        try {
            const { status, payment_status } = req.body;

            const order = await Order.findByPk(req.params.id);
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            if (status) order.status = status;
            if (payment_status) order.payment_status = payment_status;

            await order.save();

            const updatedOrder = await Order.findByPk(req.params.id, {
                include: [
                    {
                        model: OrderItem,
                        include: [Product],
                    },
                    User,
                ],
            });

            return res.status(200).json(updatedOrder);
        } catch (error) {
            console.error('❌ Error updating order:', error.message);
            return res.status(500).json({ error: error.message });
        }
    },

    // Cancel order
    async cancelOrder(req, res) {
        const t = await sequelize.transaction();

        try {
            const order = await Order.findOne({
                where: {
                    id: req.params.id,
                    UserId: req.user.id,
                    status: ['pending', 'processing']
                },
                include: [OrderItem],
                transaction: t
            });

            if (!order) {
                await t.rollback();
                return res.status(404).json({
                    message: 'Order not found or cannot be cancelled'
                });
            }

            // Update order status
            order.status = 'cancelled';
            await order.save({ transaction: t });

            // Restore product stock
            for (const item of order.OrderItems) {
                const product = await Product.findByPk(item.ProductId, { transaction: t });
                product.stock_quantity += item.quantity;
                await product.save({ transaction: t });
            }

            await t.commit();

            return res.status(200).json(order);
        } catch (error) {
            await t.rollback();
            return res.status(500).json({ error: error.message });
        }
    }
};

module.exports = OrderController;
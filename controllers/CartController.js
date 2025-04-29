// controllers/CartController.js
const { Cart, Product, User, Category, SubCategory } = require('../models');

const CartController = {
    // Get user's cart
    async getUserCart(req, res) {
        try {
            const cart = await Cart.findAll({
                where: { UserId: req.user.id },
                include: [
                    {
                        model: Product,
                        attributes: ['id', 'name', 'price', 'images', 'stock_quantity'],
                        include: [
                            { model: Category },
                            { model: SubCategory }
                        ]
                    }
                ]
            });
            return res.status(200).json(cart);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // Add item to cart
    async addToCart(req, res) {
        try {
            const { productId, quantity } = req.body;

            // Check if product exists and has enough stock
            const product = await Product.findByPk(productId);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            if (product.stock_quantity < quantity) {
                return res.status(400).json({ message: 'Not enough stock available' });
            }

            // Check if item already in cart
            let cartItem = await Cart.findOne({
                where: {
                    UserId: req.user.id,
                    ProductId: productId
                }
            });

            if (cartItem) {
                // Update quantity if already in cart
                cartItem.quantity += parseInt(quantity);
                await cartItem.save();
            } else {
                // Create new cart item
                cartItem = await Cart.create({
                    UserId: req.user.id,
                    ProductId: productId,
                    quantity: quantity
                });
            }

            // Return updated cart with product details
            const updatedCart = await Cart.findOne({
                where: { id: cartItem.id },
                include: [
                    {
                        model: Product,
                        include: [
                            { model: Category },
                            { model: SubCategory }
                        ]
                    }
                ]
            });

            return res.status(200).json(updatedCart);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // Update cart item quantity
    async updateCartItem(req, res) {
        try {
            const { quantity } = req.body;
            const cartItemId = req.params.id;

            const cartItem = await Cart.findOne({
                where: {
                    id: cartItemId,
                    UserId: req.user.id
                },
                include: [Product]
            });

            if (!cartItem) {
                return res.status(404).json({ message: 'Cart item not found' });
            }

            if (cartItem.Product.stock_quantity < quantity) {
                return res.status(400).json({ message: 'Not enough stock available' });
            }

            cartItem.quantity = quantity;
            await cartItem.save();

            // Return updated cart item with product details
            const updatedCartItem = await Cart.findOne({
                where: { id: cartItem.id },
                include: [
                    {
                        model: Product,
                        include: [
                            { model: Category },
                            { model: SubCategory }
                        ]
                    }
                ]
            });

            return res.status(200).json(updatedCartItem);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // Remove item from cart
    async removeFromCart(req, res) {
        try {
            const deleted = await Cart.destroy({
                where: {
                    id: req.params.id,
                    UserId: req.user.id
                }
            });

            if (deleted) {
                return res.status(204).send();
            }
            return res.status(404).json({ message: 'Cart item not found' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // Clear cart
    async clearCart(req, res) {
        try {
            await Cart.destroy({
                where: { UserId: req.user.id }
            });

            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
};

module.exports = CartController;
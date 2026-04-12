"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const Order_1 = require("../entities/Order");
const data_source_1 = require("../data.source");
const Cart_1 = require("../entities/Cart");
const OrderItem_1 = require("../entities/OrderItem");
const Product_1 = require("../entities/Product");
const CartItem_1 = require("../entities/CartItem");
class OrderController {
    static async placeOrder(req, res, next) {
        try {
            const userID = req.user.user_id;
            if (!userID)
                return res.status(201).json({ error: "User id is requored" });
            const { paymentMethod } = req.body;
            const validateMethods = Object.values(Order_1.PaymentMethod);
            if (!paymentMethod || !validateMethods.includes(paymentMethod)) {
                return res.status(400).json({
                    error: "Invalid payment methods",
                    validateMethods,
                });
            }
            const cart = await data_source_1.AppDataSource.getRepository(Cart_1.Cart).findOne({
                where: { user: { user_id: userID } },
                relations: { items: { product: true } },
            });
            if (!cart || cart.items.length === 0) {
                return res.status(400).json({ error: "Your cart is empty" });
            }
            const stockErrors = [];
            for (const item of cart.items) {
                if (item.product.stock < item.quantity) {
                    stockErrors.push(`"${item.product.name}" — requested ${item.quantity}, only ${item.product.stock} in stock`);
                }
            }
            if (stockErrors.length > 0) {
                return res
                    .status(400)
                    .json({ error: "Stock issues", details: stockErrors });
            }
            const order = await data_source_1.AppDataSource.transaction(async (manager) => {
                const orderItems = cart.items.map((cartItem) => {
                    const item = manager.getRepository(OrderItem_1.OrderItem).create({
                        quantity: cartItem.quantity,
                        priceAtPurchase: Number(cartItem.product.price),
                        productName: cartItem.product.name,
                        product: cartItem.product,
                    });
                    return item;
                });
                const totalAmount = orderItems.reduce((sum, item) => {
                    return sum + item.priceAtPurchase * item.quantity;
                }, 0);
                // creating entire order
                const newOrder = manager.getRepository(Order_1.Order).create({
                    user: { user_id: userID },
                    paymentMethod: paymentMethod,
                    totalAmount: Number(totalAmount.toFixed(2)),
                    items: orderItems,
                });
                //saving for order history
                await manager.getRepository(Order_1.Order).save(newOrder);
                //deducting stock product quantity
                for (const cartItem of cart.items) {
                    await manager
                        .getRepository(Product_1.Product)
                        .decrement({ product_id: cartItem.product.product_id }, "stock", cartItem.quantity);
                }
                await manager.getRepository(CartItem_1.CartItem).remove(cart.items);
                return newOrder;
            });
            const savedOrder = await data_source_1.AppDataSource.getRepository(Order_1.Order).findOne({
                where: { order_id: order.order_id },
                relations: { items: { product: true } },
            });
            return res.status(201).json({
                message: "Order placed successfully",
                order: savedOrder,
            });
        }
        catch (err) {
            next(err);
        }
    }
    //placed orders
    static async getMyOrderrs(req, res, next) {
        try {
            const userId = req.user.user_id;
            const order = await data_source_1.AppDataSource.getRepository(Order_1.Order).find({
                where: { user: { user_id: userId } },
                relations: { items: true },
                order: { placedAt: "DESC" },
            });
            return res.status(200).json(order);
        }
        catch (err) {
            next(err);
        }
    }
    //placed order details
    static async getOrderDetails(req, res, next) {
        try {
            const userId = req.user.user_id;
            const orderId = Number(req.params.orderId);
            if (isNaN(orderId)) {
                return res.status(400).json({ error: "Invalid orderId" });
            }
            const order = await data_source_1.AppDataSource.getRepository(Order_1.Order).findOne({
                where: { order_id: orderId, user: { user_id: userId } },
                relations: { items: { product: true } },
            });
            if (!order)
                return res.status(404).json({ error: "Order not found" });
            return res.status(200).json(order);
        }
        catch (error) {
            next(error);
        }
    }
    //place single order
    static async placeSingleOrder(req, res, next) {
        try {
            const userId = req.user.user_id;
            if (!userId)
                return res.status(201).json({ error: "User id is requored" });
            const { paymentMethod, productId, quantity = 1 } = req.body;
            const product = await data_source_1.AppDataSource.getRepository(Product_1.Product).findOne({
                where: { product_id: productId, isActive: true },
            });
            if (!product) {
                return res.status(404).json({ error: "Product is inactive" });
            }
            if (product.stock < quantity) {
                return res.status(400).json({
                    error: "Insufficient stock",
                    available: product.stock,
                });
            }
            const savedOrder = await data_source_1.AppDataSource.transaction(async (manager) => {
                const orderItem = manager.getRepository(OrderItem_1.OrderItem).create({
                    product: product,
                    quantity: quantity,
                    priceAtPurchase: Number(product.price),
                    productName: product.name,
                });
                const totalAmount = Number(product.price) * quantity;
                const newOrder = manager.getRepository(Order_1.Order).create({
                    user: { user_id: userId },
                    totalAmount: totalAmount,
                    paymentMethod: paymentMethod,
                    items: [orderItem],
                });
                const order = await manager.getRepository(Order_1.Order).save(newOrder);
                await manager
                    .getRepository(Product_1.Product)
                    .decrement({ product_id: productId }, "stock", quantity);
                return order;
            });
            const finalOrder = await data_source_1.AppDataSource.getRepository(Order_1.Order).findOne({
                where: { order_id: savedOrder.order_id },
                relations: { items: { product: true } },
            });
            return res
                .status(201)
                .json({ message: "Order placed successfully", order: finalOrder });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.OrderController = OrderController;

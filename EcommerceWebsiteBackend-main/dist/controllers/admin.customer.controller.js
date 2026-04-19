"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminCustomerController = void 0;
const data_source_1 = require("../data.source");
const Order_1 = require("../entities/Order");
const User_1 = require("../entities/User");
class AdminCustomerController {
    /**
     * fetch data for all customers
     * @param req
     * @param res
     * @param next
     * @returns
     */
    static async getAllCustomer(req, res, next) {
        try {
            const { page = "1", limit = "20" } = req.query;
            const pageNum = Math.max(1, parseInt(page) || 1);
            const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
            const skip = (pageNum - 1) * limitNum;
            const [customer, total] = await data_source_1.AppDataSource.getRepository(User_1.User)
                .createQueryBuilder("user")
                .where("user.role=:role", { role: User_1.UserRole.USER })
                .orderBy("user.createdAt", "DESC")
                .skip(skip)
                .take(limitNum)
                .getManyAndCount();
            return res.status(200).json({
                data: customer,
                meta: {
                    total,
                    page: pageNum,
                    limit: limitNum,
                    totalPages: Math.ceil(total / limitNum),
                },
            });
        }
        catch (err) {
            next(err);
        }
    }
    /**
     * Returns detailed data of single customer
     * @param req
     * @param res
     * @param next
     * @returns user object
     */
    static async getCustomerById(req, res, next) {
        try {
            const targetId = Number(req.params.userId);
            if (isNaN(targetId))
                return res.status(400).json({ error: "Invalid userId" });
            const user = await data_source_1.AppDataSource.getRepository(User_1.User).findOneBy({
                user_id: targetId,
                role: User_1.UserRole.USER,
            });
            if (!user)
                return res.status(404).json({ error: "Customer not found" });
            return res.status(200).json(user);
        }
        catch (err) {
            next(err);
        }
    }
    /**
     * Get all customer orders
     * @param req
     * @param res
     * @param next
     * @returns order: Orderitems array
     */
    static async getAllOrders(req, res, next) {
        try {
            const { page = "1", limit = "20" } = req.query;
            const pageNum = Math.max(1, parseInt(page) || 1);
            const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
            const skip = (pageNum - 1) * limitNum;
            const [orders, total] = await data_source_1.AppDataSource.getRepository(Order_1.Order)
                .createQueryBuilder("order")
                .leftJoinAndSelect("order.user", "user")
                .leftJoinAndSelect("order.items", "items")
                .orderBy("order.placedAt", "DESC")
                .skip(skip)
                .take(limitNum)
                .getManyAndCount();
            return res.status(200).json({
                data: orders,
                meta: {
                    total,
                    page: pageNum,
                    limit: limitNum,
                    totalPages: Math.ceil(total / limitNum),
                },
            });
        }
        catch (err) {
            next(err);
        }
    }
    /**
     * Get order details
     * @param req
     * @param res
     * @param next
     * @returns  order Details along with products in order
     */
    static async getOrderDetails(req, res, next) {
        try {
            const orderId = Number(req.params.orderId);
            console.log("hello");
            console.log("Backend received ID:", req.params.orderId);
            if (isNaN(orderId))
                return res.status(400).json({ error: "Invalid orderId" });
            const order = await data_source_1.AppDataSource.getRepository(Order_1.Order).findOne({
                where: { order_id: orderId },
                relations: { items: { product: true }, user: true },
            });
            if (!order)
                return res.status(404).json({ error: "Order not found" });
            return res.status(200).json(order);
        }
        catch (err) {
            console.log(err);
            next(err);
        }
    }
}
exports.AdminCustomerController = AdminCustomerController;

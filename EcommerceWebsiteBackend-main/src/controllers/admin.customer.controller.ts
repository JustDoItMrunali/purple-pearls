import { NextFunction, Response, Request } from "express";
import { AppDataSource } from "../data.source";
import { Order } from "../entities/Order";
import { error } from "node:console";
import { User, UserRole } from "../entities/User";

export class AdminCustomerController {
  /**
   * fetch data for all customers
   * @param req
   * @param res
   * @param next
   * @returns
   */
  static async getAllCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = "1", limit = "20" } = req.query;
      const pageNum = Math.max(1, parseInt(page as string) || 1);
      const limitNum = Math.min(
        100,
        Math.max(1, parseInt(limit as string) || 20),
      );
      const skip = (pageNum - 1) * limitNum;

      const [customer, total] = await AppDataSource.getRepository(User)
        .createQueryBuilder("user")
        .where("user.role=:role", { role: UserRole.USER })
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
    } catch (err) {
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
  static async getCustomerById(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const targetId = Number(req.params.userId);
      if (isNaN(targetId))
        return res.status(400).json({ error: "Invalid userId" });

      const user = await AppDataSource.getRepository(User).findOneBy({
        user_id: targetId,
        role: UserRole.USER,
      });
      if (!user) return res.status(404).json({ error: "Customer not found" });

      return res.status(200).json(user);
    } catch (err) {
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
  static async getAllOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = "1", limit = "20" } = req.query;
      const pageNum = Math.max(1, parseInt(page as string) || 1);
      const limitNum = Math.min(
        100,
        Math.max(1, parseInt(limit as string) || 20),
      );
      const skip = (pageNum - 1) * limitNum;

      const [orders, total] = await AppDataSource.getRepository(Order)
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
    } catch (err) {
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

  static async getOrderDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const orderId = Number(req.params.orderId);
      console.log("hello");
      console.log("Backend received ID:", req.params.orderId);

      if (isNaN(orderId))
        return res.status(400).json({ error: "Invalid orderId" });

      const order = await AppDataSource.getRepository(Order).findOne({
        where: { order_id: orderId },
        relations: { items: { product: true }, user: true },
      });

      if (!order) return res.status(404).json({ error: "Order not found" });

      return res.status(200).json(order);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

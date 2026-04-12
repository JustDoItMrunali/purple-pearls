import { NextFunction, Request, Response } from "express";
import { User } from "../entities/User";
import { error } from "node:console";
import { Order, OrderStatus, PaymentMethod } from "../entities/Order";
import { AppDataSource } from "../data.source";
import { Cart } from "../entities/Cart";
import { OrderItem } from "../entities/OrderItem";
import { Product } from "../entities/Product";
import { CartItem } from "../entities/CartItem";

export class OrderController {
  static async placeOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const userID = (req.user as User).user_id;
      const { paymentMethod } = req.body;
      const validateMethods = Object.values(PaymentMethod);
      if (!paymentMethod || !validateMethods.includes(paymentMethod)) {
        return res.status(400).json({
          error: "Invalid payment methods",
          validateMethods,
        });
      }

      const cart = await AppDataSource.getRepository(Cart).findOne({
        where: { user: { user_id: userID } },
        relations: { items: { product: true } },
      });

      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ error: "Cart is empty" });
      }

      const savedOrder = await AppDataSource.transaction(async (manager) => {
        let totalAmount = 0;
        const orderItems = cart.items.map((cartItem) => {
          const subtotal = Number(cartItem.product.price) * cartItem.quantity;
          totalAmount += subtotal;

          return manager.getRepository(OrderItem).create({
            quantity: cartItem.quantity,
            priceAtPurchase: Number(cartItem.product.price),
            productName: cartItem.product.name,
            product: cartItem.product,
          });
        });

        const newOrder = manager.getRepository(Order).create({
          user: { user_id: userID } as User,
          paymentMethod,
          totalAmount: Number(totalAmount.toFixed(2)),
          items: orderItems,
        });

        const order = await manager.save(newOrder);

        for (const cartItem of cart.items) {
          await manager
            .getRepository(Product)
            .decrement(
              { product_id: cartItem.product.product_id },
              "stock",
              cartItem.quantity,
            );
        }

        await manager.getRepository(CartItem).remove(cart.items);

        return order;
      });

      return res.status(201).json({
        message: "Order placed successfully!",
        orderId: savedOrder.order_id,
        total: savedOrder.totalAmount,
      });
    } catch (err) {
      next(err);
    }
  }

  //placed orders
  static async getMyOrderrs(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as User).user_id;

      const order = await AppDataSource.getRepository(Order).find({
        where: { user: { user_id: userId } },
        relations: { items: true },
        order: { placedAt: "DESC" },
      });
      return res.status(200).json(order);
    } catch (err) {
      next(err);
    }
  }

  static async cancelOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as User).user_id;
      const orderId = Number(req.params.orderId);

      const orderRepo = AppDataSource.getRepository(Order);
      const order = await orderRepo.findOne({
        where: { order_id: orderId, user: { user_id: userId } },
        relations: { items: { product: true } },
      });

      if (!order) {
        return res.status(404).json({ error: "Order doesnt exists" });
      }

      if (
        order.status !== OrderStatus.CANCELLED &&
        order.status !== OrderStatus.PENDING
      ) {
        return res.status(400).json({
          error: "Cannot cancel order once it is Shipped or Delivered",
        });
      }

      await AppDataSource.transaction(async (manager) => {
        for (const item of order.items) {
          await manager
            .getRepository(Product)
            .increment(
              { product_id: item.product?.product_id },
              "stock",
              item.quantity,
            );
        }
        order.status = OrderStatus.CANCELLED;
        await manager.save(order);
      });
      return res
        .status(200)
        .json({ message: "Order cancelled successfully and stock updated" });
    } catch (err) {
      next(err);
    }
  }
  //placed order detail
  static async getOrderDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = (req.user as User).user_id;
      const orderId = Number(req.params.orderId);

      if (isNaN(orderId)) {
        return res.status(400).json({ error: "Invalid orderId" });
      }

      const order = await AppDataSource.getRepository(Order).findOne({
        where: { order_id: orderId, user: { user_id: userId } },
        relations: { items: { product: true } },
      });

      if (!order) return res.status(404).json({ error: "Order not found" });

      return res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  }

  //place single order
  static async placeSingleOrder(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = (req.user as User).user_id;
      if (!userId)
        return res.status(201).json({ error: "User id is requored" });
      const { paymentMethod, productId, quantity = 1 } = req.body;
      const product = await AppDataSource.getRepository(Product).findOne({
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

      const savedOrder = await AppDataSource.transaction(async (manager) => {
        const orderItem = manager.getRepository(OrderItem).create({
          product: product,
          quantity: quantity,
          priceAtPurchase: Number(product.price),
          productName: product.name,
        });

        const totalAmount = Number(product.price) * quantity;

        const newOrder = manager.getRepository(Order).create({
          user: { user_id: userId } as User,
          totalAmount: totalAmount,
          paymentMethod: paymentMethod as PaymentMethod,
          items: [orderItem],
        });

        const order = await manager.getRepository(Order).save(newOrder);

        await manager
          .getRepository(Product)
          .decrement({ product_id: productId }, "stock", quantity);

        return order;
      });

      const finalOrder = await AppDataSource.getRepository(Order).findOne({
        where: { order_id: savedOrder.order_id },
        relations: { items: { product: true } },
      });

      return res
        .status(201)
        .json({ message: "Order placed successfully", order: finalOrder });
    } catch (err) {
      next(err);
    }
  }
}

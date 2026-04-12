import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.middleware";
import { UserRole } from "../entities/User";
import { OrderController } from "../controllers/order.controller";

const OrderRouter = Router();

OrderRouter.post(
  "/place_order",
  requireAuth,
  requireRole(UserRole.USER),
  OrderController.placeOrder,
);
OrderRouter.get(
  "/get_my_orders",
  requireAuth,
  requireRole(UserRole.USER),
  OrderController.getMyOrderrs,
);
OrderRouter.get(
  "/orders/:orderID",
  requireAuth,
  requireRole(UserRole.USER),
  OrderController.getOrderDetails,
);
OrderRouter.post(
  "/place_single_order",
  requireAuth,
  requireRole(UserRole.USER),
  OrderController.placeSingleOrder,
);
OrderRouter.delete(
  "/delete_order/:orderId",
  requireAuth,
  requireRole(UserRole.USER),
  OrderController.cancelOrder,
);
export default OrderRouter;

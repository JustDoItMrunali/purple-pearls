import { Router } from "express";

import { UserRole } from "../entities/User";
import { requireAuth, requireRole } from "../middleware/auth.middleware";
import { AdminCustomerController } from "../controllers/admin.customer.controller";

// const AdminCustomerRouter = Router();

const AdminCustomerRouter = Router({ mergeParams: true });
AdminCustomerRouter.use(requireAuth);
AdminCustomerRouter.use(requireRole(UserRole.ADMIN));

AdminCustomerRouter.get(
  "/orders/:orderId",
  AdminCustomerController.getOrderDetails,
);
AdminCustomerRouter.get("/orders", AdminCustomerController.getAllOrders);

AdminCustomerRouter.get("/customers", AdminCustomerController.getAllCustomer);
AdminCustomerRouter.get(
  "/customers/:userId",
  AdminCustomerController.getCustomerById,
);
export default AdminCustomerRouter;

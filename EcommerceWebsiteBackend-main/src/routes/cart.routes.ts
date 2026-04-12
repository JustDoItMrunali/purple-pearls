import { Router } from "express";
import { CartController } from "../controllers/cart.controller";
import { requireAuth, requireRole } from "../middleware/auth.middleware";
import { UserRole } from "../entities/User";

const CartRouter = Router();
CartRouter.use(requireAuth);
CartRouter.use(requireRole(UserRole.USER));
CartRouter.get("/view-cart", CartController.getCart);
CartRouter.post("/addTo-cart/items", CartController.addItem);
CartRouter.patch("/update-cart/:cartItemId", CartController.updateItem);
CartRouter.delete("/removeItem-cart/:cartItemId", CartController.removeItem);
CartRouter.delete("/clear-cart", CartController.clearCart);

export default CartRouter;

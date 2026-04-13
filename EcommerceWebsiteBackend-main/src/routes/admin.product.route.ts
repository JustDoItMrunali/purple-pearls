import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.middleware";
import { UserRole } from "../entities/User";
import { AdminProductController } from "../controllers/admin.product.controller";
import { upload } from "../middleware/multer.middleware";

const AdminProductRouter = Router();
AdminProductRouter.use(requireAuth);
AdminProductRouter.use(requireRole(UserRole.ADMIN));
AdminProductRouter.get("/get-products", AdminProductController.getAllProducts);
AdminProductRouter.post(
  "/upload-product",
  upload.single("imagePath"),
  AdminProductController.createProduct,
);
AdminProductRouter.patch(
  "/update-products/:productID",
  upload.single("imagePath"),
  AdminProductController.updateProduct,
);

AdminProductRouter.delete(
  "/products/:productId",
  AdminProductController.deleteProduct,
);
export default AdminProductRouter;

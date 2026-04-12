import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.middleware";
import { UserRole } from "../entities/User";
import { ReviewController } from "../controllers/review.controller";

 const ReviewRoutes = Router();
ReviewRoutes.post("/add-review/:productId",requireAuth, requireRole(UserRole.USER),ReviewController.addReview);
ReviewRoutes.get("/get-review/:productId",ReviewController.getProductReview); //everyone can view it

export default ReviewRoutes;

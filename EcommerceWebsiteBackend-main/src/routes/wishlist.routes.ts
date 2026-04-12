import { Router } from "express";
import { WishlistController } from "../controllers/wishlist.controller";
import { requireAuth } from "../middleware/auth.middleware";

const WishlistRouter = Router();

/**
 * @route   GET /api/wishlist
 * @desc    Get the logged-in user's wishlist items
 * @access  Private
 */
WishlistRouter.get("/my-wishlist", requireAuth, WishlistController.getMyWishlist);

/**
 * @route   POST /api/wishlist/toggle
 * @desc    Add or Remove a product from the wishlist
 * @access  Private
 * @body    { "productId": number }
 */
WishlistRouter.post("/toggle", requireAuth, WishlistController.addWishlist);

/**
 * @route   DELETE /api/wishlist/:productId
 * @desc    Optional: Direct delete if you don't want to use the toggle method
 */
// router.delete("/:productId", isAuth, WishlistController.removeFromWishlist);

export default WishlistRouter;

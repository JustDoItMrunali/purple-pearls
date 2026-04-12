"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const wishlist_controller_1 = require("../controllers/wishlist.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const WishlistRouter = (0, express_1.Router)();
/**
 * @route   GET /api/wishlist
 * @desc    Get the logged-in user's wishlist items
 * @access  Private
 */
WishlistRouter.get("/", auth_middleware_1.requireAuth, wishlist_controller_1.WishlistController.getMyWishlist);
/**
 * @route   POST /api/wishlist/toggle
 * @desc    Add or Remove a product from the wishlist
 * @access  Private
 * @body    { "productId": number }
 */
WishlistRouter.post("/toggle", auth_middleware_1.requireAuth, wishlist_controller_1.WishlistController.addWishlist);
/**
 * @route   DELETE /api/wishlist/:productId
 * @desc    Optional: Direct delete if you don't want to use the toggle method
 */
// router.delete("/:productId", isAuth, WishlistController.removeFromWishlist);
exports.default = WishlistRouter;

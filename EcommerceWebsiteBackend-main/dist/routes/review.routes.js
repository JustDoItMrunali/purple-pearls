"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const User_1 = require("../entities/User");
const review_controller_1 = require("../controllers/review.controller");
const ReviewRoutes = (0, express_1.Router)();
ReviewRoutes.post("/add-review/:productId", auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)(User_1.UserRole.USER), review_controller_1.ReviewController.addReview);
ReviewRoutes.get("/get-review/:productId", review_controller_1.ReviewController.getProductReview); //everyone can view it
exports.default = ReviewRoutes;

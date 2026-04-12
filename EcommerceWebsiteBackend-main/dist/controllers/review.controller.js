"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const data_source_1 = require("../data.source");
const Product_1 = require("../entities/Product");
const Review_1 = require("../entities/Review");
class ReviewController {
    static async addReview(req, res, next) {
        try {
            const userId = req.user.user_id;
            const productId = Number(req.params.productId);
            const { rating, comment } = req.body;
            if (isNaN(productId))
                return res.status(400).json({ error: "Invalid productId" });
            if (!rating || !comment) {
                return res
                    .status(400)
                    .json({ error: "Comments and ratings are required" });
            }
            const ratingNum = parseInt(rating);
            if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
                return res
                    .status(400)
                    .json({ error: "rating must be between 1 and 5" });
            }
            const product = await data_source_1.AppDataSource.getRepository(Product_1.Product).findOneBy({
                product_id: productId,
                isActive: true,
            });
            if (!product)
                return res.status(404).json({ error: "Product not found" });
            const reviewRepo = await data_source_1.AppDataSource.getRepository(Review_1.Review);
            const review = reviewRepo.create({
                rating: ratingNum,
                comment: comment.trim(),
                user: { user_id: userId },
                product: { product_id: productId },
            });
            await reviewRepo.save(review);
            return res
                .status(201)
                .json({ message: "Review submitted", review_id: review.review_id });
        }
        catch (err) {
            next(err);
        }
    }
    /**
     * Function to get all reviews
     * @param req
     * @param res
     * @param next
     */
    static async getProductReview(req, res, next) {
        try {
            const productId = Number(req.params.productId);
            if (isNaN(productId))
                return res.status(400).json({ error: "Invalid ProductId" });
            const product = await data_source_1.AppDataSource.getRepository(Product_1.Product).findOneBy({
                product_id: productId,
                isActive: true,
            });
            if (!product)
                return res.status(404).json({ error: "Product not found" });
            const reviews = await data_source_1.AppDataSource.getRepository(Review_1.Review).find({
                where: { product: { product_id: productId } },
                relations: { user: true },
                order: { createdAt: "DESC" },
            });
            const avgRating = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : null;
            return res.status(200).json({
                product_id: productId,
                totalReview: reviews.length,
                averageRating: avgRating ? Number(avgRating.toFixed(1)) : null,
                reviews: reviews.map(r => ({
                    review_id: r.review_id,
                    rating: r.rating,
                    comment: r.comment,
                    createdAt: r.createdAt,
                    user: { name: r.user.name },
                }))
            });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.ReviewController = ReviewController;

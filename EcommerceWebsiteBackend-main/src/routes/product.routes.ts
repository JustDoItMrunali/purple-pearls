import { Router } from "express";
import { ProductController } from "../controllers/product.controller";

const ProductRouter = Router();

/**
 * @route   GET /api/products
 * @desc    Get all products with filtering, pagination, and taxonomy logic
 * @access  Public
 */
ProductRouter.get("/get-products", ProductController.getProduct);

/**
 * @route   GET /api/products/search
 * @desc    Dedicated cross-taxonomy search
 * @access  Public
 */
ProductRouter.get("/search", ProductController.searchProducts);

/**
 * @route   GET /api/products/:productId
 * @desc    Get a single product by ID with breadcrumb data
 * @access  Public
 */
ProductRouter.get("/:productId", ProductController.getProductById);

ProductRouter.get("/filter", ProductController.getFilteredProducts); // New route
export default ProductRouter;

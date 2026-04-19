"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const ProductRouter = (0, express_1.Router)();
/**
 * @route   GET /api/products
 * @desc    Get all products with filtering, pagination, and taxonomy logic
 * @access  Public
 */
ProductRouter.get("/get-products", product_controller_1.ProductController.getProduct);
/**
 * @route   GET /api/products/:productId
 * @desc    Get a single product by ID with breadcrumb data
 * @access  Public
 */
ProductRouter.get("/:productId", product_controller_1.ProductController.getProductById);
exports.default = ProductRouter;

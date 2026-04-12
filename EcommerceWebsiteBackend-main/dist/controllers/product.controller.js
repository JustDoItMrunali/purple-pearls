"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const data_source_1 = require("../data.source");
const Product_1 = require("../entities/Product");
const typeorm_1 = require("typeorm");
class ProductController {
    static async getProduct(req, res, next) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const pageNum = Math.max(parseInt(page) || 1);
            const limitNum = Math.min(20, Math.max(1, parseInt(limit) || 10));
            const skip = (pageNum - 1) * limitNum;
            const [products, total] = await data_source_1.AppDataSource.getRepository(Product_1.Product).findAndCount({
                where: { isActive: true },
                order: { createdAt: "DESC" },
                take: limitNum,
                skip: skip,
                relations: ["subcategory", "subCategory.category"],
            });
            return res.status(200).json({
                data: { products },
                meta: {
                    total,
                    page: pageNum,
                    limit: limitNum,
                    totalPages: Math.ceil(total / limitNum),
                },
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async getProductById(req, res, next) {
        try {
            const productId = Number(req.params.productId);
            if (isNaN(productId))
                return res.status(400).json({ error: "Invalid ID" });
            const product = await data_source_1.AppDataSource.getRepository(Product_1.Product).findOne({
                where: { product_id: productId, isActive: true },
                relations: [
                    "subCategory",
                    "subCategory.category",
                    "subCategory.category.productType",
                ],
            });
            if (!product)
                return res.status(404).json({ error: "Product not found" });
            const breadcrumb = {
                type: product.subCategory.category.productType.name,
                category: product.subCategory.category.name,
                subCategory: product.subCategory.name,
            };
            return res.status(200).json({ ...product, breadcrumb });
        }
        catch (err) {
            next(err);
        }
    }
    static async getFilteredProducts(req, res, next) {
        try {
            const { typeId, categoryId, subCategoryId, minPrice, maxPrice, inStock } = req.query;
            const qb = data_source_1.AppDataSource.getRepository(Product_1.Product)
                .createQueryBuilder("product")
                .leftJoinAndSelect("product.subCategory", "subCategory")
                .leftJoinAndSelect("subCategory.category", "category")
                .leftJoinAndSelect("category.productType", "productType")
                .where("product.isActive = :active", { active: true });
            if (subCategoryId) {
                qb.andWhere("subCategory.sub_category_id = :subId", {
                    subId: Number(subCategoryId),
                });
            }
            else if (categoryId) {
                qb.andWhere("category.category_id = :catId", {
                    catId: Number(categoryId),
                });
            }
            else if (typeId) {
                qb.andWhere("productType.type_id = :typeId", {
                    typeId: Number(typeId),
                });
            }
            //Price filters
            if (minPrice) {
                qb.andWhere("product.price >= :min", { min: Number(minPrice) });
            }
            if (maxPrice) {
                qb.andWhere("product.price <= :max", { max: Number(maxPrice) });
            }
            //Stock filters
            if (inStock === "true") {
                qb.andWhere("product.stock > 0");
            }
            const products = await qb.orderBy("product.price", "ASC").getMany();
            return res.status(200).json({ data: products });
        }
        catch (err) {
            next(err);
        }
    }
    /**
     * Dedicated Search Logic: Keyword search across Name and Description
     */
    static async searchProducts(req, res, next) {
        try {
            const { q } = req.query;
            if (!q || typeof q !== "string" || q.trim() === "") {
                return res.status(400).json({ error: "Search keyword is required" });
            }
            const term = `%${q.trim().toLowerCase()}%`;
            const [products, total] = await data_source_1.AppDataSource.getRepository(Product_1.Product)
                .createQueryBuilder("product")
                .leftJoinAndSelect("product.subCategory", "subCategory")
                .where("product.isActive = :active", { active: true })
                .andWhere(new typeorm_1.Brackets((inner) => {
                inner
                    .where("LOWER(product.name) LIKE :term", { term })
                    .orWhere("LOWER(product.description) LIKE :term", { term });
            }))
                .orderBy("product.name", "ASC")
                .getManyAndCount();
            return res.status(200).json({ data: products, total, query: q });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.ProductController = ProductController;

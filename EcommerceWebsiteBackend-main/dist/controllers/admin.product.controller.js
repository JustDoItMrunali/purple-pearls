"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminProductController = void 0;
const data_source_1 = require("../data.source");
const Product_1 = require("../entities/Product");
const SubCategory_1 = require("../entities/SubCategory");
class AdminProductController {
    static async getAllProducts(req, res, next) {
        try {
            const { page = "1", limit = "20" } = req.query;
            const pageNum = Math.max(1, parseInt(page) || 1);
            const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
            const skip = (pageNum - 1) * limitNum;
            const [products, total] = await data_source_1.AppDataSource.getRepository(Product_1.Product)
                .createQueryBuilder("product")
                .leftJoinAndSelect("product.subCategory", "subCategory")
                .leftJoinAndSelect("subCategory.category", "category")
                .leftJoinAndSelect("category.productType", "productType")
                .orderBy("product.createdAt", "DESC")
                .skip(skip)
                .take(limitNum)
                .getManyAndCount();
            return res.status(200).json({
                data: products,
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
    static async createProduct(req, res, next) {
        try {
            const { name, description, price, stock, subCategoryId } = req.body;
            if (!name || !price || !stock || !subCategoryId) {
                return res
                    .status(400)
                    .json({ error: "name, price and subCategoryId are required" });
            }
            const priceNum = parseFloat(price);
            const stockNum = parseInt(stock ?? "0");
            if (isNaN(priceNum) || priceNum < 0) {
                return res.status(400).json({ error: "Price number isnt valid" });
            }
            if (isNaN(stockNum) || stockNum < 0) {
                return res.status(400).json({ error: "Stock number isnt valid" });
            }
            const subCategory = await data_source_1.AppDataSource.getRepository(SubCategory_1.SubCategory).findOneBy({
                sub_category_id: Number(subCategoryId),
            });
            if (!subCategory)
                return res.status(404).json({ error: "SubCategory not found" });
            const productRepo = await data_source_1.AppDataSource.getRepository(Product_1.Product);
            const product = productRepo.create({
                name: name.trim(),
                description: description?.trim() ?? null,
                price: priceNum,
                stock: stockNum,
                subCategory,
                isActive: true,
            });
            await productRepo.save(product);
            return res
                .status(201)
                .json({ message: "Product created", product_id: product.product_id });
        }
        catch (err) {
            next(err);
        }
    }
    static async deleteProduct(req, res, next) {
        try {
            const productId = Number(req.params.productId);
            if (isNaN(productId))
                return res.status(400).json({ error: "Invalid productId" });
            const productRepo = data_source_1.AppDataSource.getRepository(Product_1.Product);
            const product = await productRepo.findOneBy({ product_id: productId });
            if (!product)
                return res.status(400).json({ error: "product doesnt exist" });
            product.isActive = false;
            await productRepo.save(product);
            return res.status(200).json({ message: "Product deactivated" });
        }
        catch (err) {
            next(err);
        }
    }
    static async updateProduct(req, res, next) {
        try {
            const productID = Number(req.params.productID);
            if (isNaN(productID))
                return res.status(400).json({ error: "ProductID is invalid" });
            const productRepo = await data_source_1.AppDataSource.getRepository(Product_1.Product);
            const product = await productRepo.findOne({
                where: { product_id: productID },
                relations: { subCategory: true },
            });
            if (!product)
                return res.status(400).json({ error: "Product not found" });
            const { name, description, price, stock, subCategoryId, isActive } = req.body;
            if (name !== undefined)
                product.name = name.trim();
            if (description !== undefined)
                product.description = description.trim();
            if (isActive !== undefined)
                product.isActive = isActive === "true" || isActive === true;
            if (price !== undefined) {
                const priceNum = parseFloat(price);
                if (isNaN(priceNum) || priceNum < 0) {
                    return res
                        .status(400)
                        .json({ error: "price must be a positive number" });
                }
                product.price = priceNum;
            }
            if (stock !== undefined) {
                const stockNum = parseInt(stock);
                if (isNaN(stockNum) || stockNum < 0) {
                    return res
                        .status(400)
                        .json({ error: "stock must be a non-negative integer" });
                }
                product.stock = stockNum;
            }
            if (subCategoryId !== undefined) {
                const subCategory = await data_source_1.AppDataSource.getRepository(SubCategory_1.SubCategory).findOneBy({
                    sub_category_id: Number(subCategoryId),
                });
                if (!subCategory)
                    return res.status(404).json({ error: "SubCategory not found" });
                product.subCategory = subCategory;
            }
            await productRepo.save(product);
            return res.status(200).json({ message: "Product updated", product });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.AdminProductController = AdminProductController;

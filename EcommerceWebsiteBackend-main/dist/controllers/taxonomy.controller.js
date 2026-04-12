"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxonomyController = void 0;
const data_source_1 = require("../data.source");
const ProductType_1 = require("../entities/ProductType");
const Category_1 = require("../entities/Category");
const SubCategory_1 = require("../entities/SubCategory");
class TaxonomyController {
    //Returns all productTypes
    static async getAllTypes(req, res, next) {
        try {
            const type = await data_source_1.AppDataSource.getRepository(ProductType_1.ProductType).find({
                order: { name: "ASC" },
            });
            return res.status(200).json(type);
        }
        catch (error) {
            next(error);
        }
    }
    //Returns all category of single product type
    static async getCategoriesType(req, res, next) {
        try {
            const typeId = Number(req.params.typeId);
            if (isNaN(typeId))
                return res.status(400).json({ error: "Imvalid typeId" });
            const type = await data_source_1.AppDataSource.getRepository(ProductType_1.ProductType).findOneBy({
                type_id: typeId,
            });
            if (!type)
                return res.status(404).json({ error: "Product not found" });
            const categories = await data_source_1.AppDataSource.getRepository(Category_1.Category).find({
                where: { productType: { type_id: typeId } },
                order: { name: "ASC" },
            });
            return res.status(200).json({ type: type.name, categories });
        }
        catch (err) {
            next(err);
        }
    }
    //returns all subcategory under categoroes
    static async getSubCategoriesType(req, res, next) {
        try {
            const categoryId = Number(req.params.categoryId);
            if (isNaN(categoryId))
                return res.status(400).json({ error: "Imvalid categoryId" });
            const categoryType = await data_source_1.AppDataSource.getRepository(Category_1.Category).findOne({
                where: { category_id: categoryId },
                relations: ["productType"],
            });
            if (!categoryType)
                return res.status(404).json({ error: "Category not found" });
            const subCategories = await data_source_1.AppDataSource.getRepository(SubCategory_1.SubCategory).find({
                where: { category: { category_id: categoryId } },
                order: { name: "ASC" },
            });
            return res.status(200).json({
                type: categoryType.productType.name,
                category: categoryType.name,
                subCategories,
            });
        }
        catch (err) {
            next(err);
        }
    }
    // Returns a single category by id
    static async getCategoryById(req, res, next) {
        try {
            const categoryId = Number(req.params.categoryId);
            if (isNaN(categoryId))
                return res.status(400).json({ error: "Invalid categoryId" });
            const category = await data_source_1.AppDataSource.getRepository(Category_1.Category).findOne({
                where: { category_id: categoryId },
                relations: { productType: true },
            });
            if (!category)
                return res.status(404).json({ error: "Category not found" });
            return res.status(200).json(category);
        }
        catch (err) {
            next(err);
        }
    }
    static async getSubCategoryById(req, res, next) {
        try {
            const subCategoryId = Number(req.params.subCategoryId);
            if (isNaN(subCategoryId))
                return res.status(400).json({ error: "Invalid subCategoryId" });
            const subCategory = await data_source_1.AppDataSource.getRepository(SubCategory_1.SubCategory).findOne({
                where: { sub_category_id: subCategoryId },
                relations: { category: { productType: true } },
            });
            if (!subCategory)
                return res.status(404).json({ error: "SubCategory not found" });
            return res.status(200).json(subCategory);
        }
        catch (err) {
            next(err);
        }
    }
}
exports.TaxonomyController = TaxonomyController;

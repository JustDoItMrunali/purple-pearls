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
    static async getSubCategories(req, res, next) {
        try {
            const subCategory = await data_source_1.AppDataSource.getRepository(SubCategory_1.SubCategory).find({
                order: { name: "ASC" },
            });
            return res.status(200).json(subCategory);
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
}
exports.TaxonomyController = TaxonomyController;

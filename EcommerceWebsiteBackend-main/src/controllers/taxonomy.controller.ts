import { NextFunction, Response, Request } from "express";
import { AppDataSource } from "../data.source";
import { ProductType } from "../entities/ProductType";
import { error } from "node:console";
import { Category } from "../entities/Category";
import { SubCategory } from "../entities/SubCategory";

export class TaxonomyController {
  //Returns all productTypes
  static async getAllTypes(req: Request, res: Response, next: NextFunction) {
    try {
      const type = await AppDataSource.getRepository(ProductType).find({
        order: { name: "ASC" },
      });
      return res.status(200).json(type);
    } catch (error) {
      next(error);
    }
  }

  //Returns all category of single product type
  static async getCategoriesType(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const typeId = Number(req.params.typeId);

      if (isNaN(typeId))
        return res.status(400).json({ error: "Imvalid typeId" });

      const type = await AppDataSource.getRepository(ProductType).findOneBy({
        type_id: typeId,
      });
      if (!type) return res.status(404).json({ error: "Product not found" });

      const categories = await AppDataSource.getRepository(Category).find({
        where: { productType: { type_id: typeId } },
        order: { name: "ASC" },
      });
      return res.status(200).json({ type: type.name, categories });
    } catch (err) {
      next(err);
    }
  }

  //returns all subcategory under categoroes
  static async getSubCategoriesType(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const categoryId = Number(req.params.categoryId);

      if (isNaN(categoryId))
        return res.status(400).json({ error: "Imvalid categoryId" });

      const categoryType = await AppDataSource.getRepository(Category).findOne({
        where: { category_id: categoryId },
        relations: ["productType"],
      });
      if (!categoryType)
        return res.status(404).json({ error: "Category not found" });

      const subCategories = await AppDataSource.getRepository(SubCategory).find(
        {
          where: { category: { category_id: categoryId } },
          order: { name: "ASC" },
        },
      );
      return res.status(200).json({
        type: categoryType.productType.name,
        category: categoryType.name,
        subCategories,
      });
    } catch (err) {
      next(err);
    }
  }

  // Returns a single category by id
  static async getCategoryById(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const categoryId = Number(req.params.categoryId);
      if (isNaN(categoryId))
        return res.status(400).json({ error: "Invalid categoryId" });

      const category = await AppDataSource.getRepository(Category).findOne({
        where: { category_id: categoryId },
        relations: { productType: true },
      });
      if (!category)
        return res.status(404).json({ error: "Category not found" });

      return res.status(200).json(category);
    } catch (err) {
      next(err);
    }
  }

  static async getSubCategoryById(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const subCategoryId = Number(req.params.subCategoryId);
      if (isNaN(subCategoryId))
        return res.status(400).json({ error: "Invalid subCategoryId" });

      const subCategory = await AppDataSource.getRepository(
        SubCategory,
      ).findOne({
        where: { sub_category_id: subCategoryId },
        relations: { category: { productType: true } },
      });
      if (!subCategory)
        return res.status(404).json({ error: "SubCategory not found" });

      return res.status(200).json(subCategory);
    } catch (err) {
      next(err);
    }
  }
}

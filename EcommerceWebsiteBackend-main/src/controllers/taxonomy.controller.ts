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

  static async getSubCategories(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const subCategory = await AppDataSource.getRepository(SubCategory).find({
        order: { name: "ASC" },
      });
      return res.status(200).json(subCategory);
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

}

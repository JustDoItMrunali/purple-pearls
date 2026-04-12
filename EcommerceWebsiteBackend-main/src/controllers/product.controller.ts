import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data.source";
import { Product } from "../entities/Product";
import { Brackets, createQueryBuilder } from "typeorm";

export class ProductController {
  // static async getProduct(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const { page = 1, limit = 10 } = req.query;
  //     const pageNum = Math.max(parseInt(page as string) || 1);
  //     const limitNum = Math.min(
  //       20,
  //       Math.max(1, parseInt(limit as string) || 10),
  //     );

  //     const skip = (pageNum - 1) * limitNum;

  //     const [products, total] = await AppDataSource.getRepository(
  //       Product,
  //     ).findAndCount({
  //       where: { isActive: true },
  //       order: { createdAt: "DESC" },
  //       take: limitNum,
  //       skip: skip,
  //       relations: [
  //         "subCategory",
  //         "subCategory.category",
  //         "subCategory.category.productType",
  //       ],
  //     });

  //     return res.status(200).json({
  //       data: products,
  //       meta: {
  //         total,
  //         page: pageNum,
  //         limit: limitNum,
  //         totalPages: Math.ceil(total / limitNum),
  //       },
  //     });
  //   } catch (err) {
  //     next(err);
  //   }
  // }

  static async getProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        page = 1,
        limit = 10,
        typeId,
        categoryId,
        subCategoryId,
        minPrice,
        maxPrice,
        inStock,
        q,
      } = req.query;

      const pageNum = Math.max(1, parseInt(page as string) || 1);
      const limitNum = Math.min(20, parseInt(limit as string) || 10);
      const skip = (pageNum - 1) * limitNum;

      const qb = AppDataSource.getRepository(Product)
        .createQueryBuilder("product")
        .leftJoinAndSelect("product.subCategory", "subCategory")
        .leftJoinAndSelect("subCategory.category", "category")
        .leftJoinAndSelect("category.productType", "productType")
        .where("product.isActive = :active", { active: true });

      // --- Search Logic ---
      if (q) {
        const term = `%${(q as string).trim().toLowerCase()}%`;
        qb.andWhere(
          new Brackets((inner) => {
            inner
              .where("LOWER(product.name) LIKE :term", { term })
              .orWhere("LOWER(product.description) LIKE :term", { term });
          }),
        );
      }

      // --- Filter Logic ---
      if (subCategoryId) {
        qb.andWhere("subCategory.sub_category_id = :subId", {
          subId: Number(subCategoryId),
        });
      } else if (categoryId) {
        qb.andWhere("category.category_id = :catId", {
          catId: Number(categoryId),
        });
      } else if (typeId) {
        qb.andWhere("productType.type_id = :typeId", {
          typeId: Number(typeId),
        });
      }

      if (minPrice)
        qb.andWhere("product.price >= :min", { min: Number(minPrice) });
      if (maxPrice)
        qb.andWhere("product.price <= :max", { max: Number(maxPrice) });
      if (inStock === "true") qb.andWhere("product.stock > 0");

      // --- Pagination & Execution ---
      const [products, total] = await qb
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
    } catch (err) {
      next(err);
    }
  }

  static async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = Number(req.params.productId);
      if (isNaN(productId))
        return res.status(400).json({ error: "Invalid ID" });
      const product = await AppDataSource.getRepository(Product).findOne({
        where: { product_id: productId, isActive: true },
        relations: [
          "subCategory",
          "subCategory.category",
          "subCategory.category.productType",
        ],
      });

      if (!product) return res.status(404).json({ error: "Product not found" });
      const breadcrumb = {
        type: product.subCategory.category.productType.name,
        category: product.subCategory.category.name,
        subCategory: product.subCategory.name,
      };

      return res.status(200).json({ ...product, breadcrumb });
    } catch (err) {
      next(err);
    }
  }

  static async getFilteredProducts(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { typeId, categoryId, subCategoryId, minPrice, maxPrice, inStock } =
        req.query;

      const qb = AppDataSource.getRepository(Product)
        .createQueryBuilder("product")
        .leftJoinAndSelect("product.subCategory", "subCategory")
        .leftJoinAndSelect("subCategory.category", "category")
        .leftJoinAndSelect("category.productType", "productType")
        .where("product.isActive = :active", { active: true });

      if (subCategoryId) {
        qb.andWhere("subCategory.sub_category_id = :subId", {
          subId: Number(subCategoryId),
        });
      } else if (categoryId) {
        qb.andWhere("category.category_id = :catId", {
          catId: Number(categoryId),
        });
      } else if (typeId) {
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
    } catch (err) {
      next(err);
    }
  }

  /**
   * Dedicated Search Logic: Keyword search across Name and Description
   */
  static async searchProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const { q } = req.query;

      if (!q || typeof q !== "string" || q.trim() === "") {
        return res.status(400).json({ error: "Search keyword is required" });
      }

      const term = `%${q.trim().toLowerCase()}%`;

      const [products, total] = await AppDataSource.getRepository(Product)
        .createQueryBuilder("product")
        .leftJoinAndSelect("product.subCategory", "subCategory")
        .where("product.isActive = :active", { active: true })
        .andWhere(
          new Brackets((inner) => {
            inner
              .where("LOWER(product.name) LIKE :term", { term })
              .orWhere("LOWER(product.description) LIKE :term", { term });
          }),
        )
        .orderBy("product.name", "ASC")
        .getManyAndCount();

      return res.status(200).json({ data: products, total, query: q });
    } catch (err) {
      next(err);
    }
  }
}

import { Router } from "express";
import { TaxonomyController } from "../controllers/taxonomy.controller";

const TaxonomyRouter = Router();

TaxonomyRouter.get("/product_type", TaxonomyController.getAllTypes);
TaxonomyRouter.get(
  "/product_type/:typeId/categories",
  TaxonomyController.getCategoriesType,
);
TaxonomyRouter.get(
  "/categories/:categoryId",
  TaxonomyController.getCategoryById,
);
TaxonomyRouter.get(
  "/categories/:categoryId/subcategories",
  TaxonomyController.getSubCategoriesType,
);

TaxonomyRouter.get(
  "/subcategories/:subCategoryId",
  TaxonomyController.getSubCategoryById,
);

export default TaxonomyRouter;

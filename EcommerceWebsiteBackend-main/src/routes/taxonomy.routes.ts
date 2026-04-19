import { Router } from "express";
import { TaxonomyController } from "../controllers/taxonomy.controller";

const TaxonomyRouter = Router();

TaxonomyRouter.get("/product_type", TaxonomyController.getAllTypes);
TaxonomyRouter.get("/subcategory", TaxonomyController.getSubCategories);

TaxonomyRouter.get(
  "/product_type/:typeId/categories",
  TaxonomyController.getCategoriesType,
);

export default TaxonomyRouter;

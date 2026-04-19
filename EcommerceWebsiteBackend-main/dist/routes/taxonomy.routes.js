"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taxonomy_controller_1 = require("../controllers/taxonomy.controller");
const TaxonomyRouter = (0, express_1.Router)();
TaxonomyRouter.get("/product_type", taxonomy_controller_1.TaxonomyController.getAllTypes);
TaxonomyRouter.get("/subcategory", taxonomy_controller_1.TaxonomyController.getSubCategories);
TaxonomyRouter.get("/product_type/:typeId/categories", taxonomy_controller_1.TaxonomyController.getCategoriesType);
exports.default = TaxonomyRouter;

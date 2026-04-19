import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Product } from "./entities/Product";
import { ProductType } from "./entities/ProductType";
import { SubCategory } from "./entities/SubCategory";
import { Category } from "./entities/Category";
import { Order } from "./entities/Order";
import { OrderItem } from "./entities/OrderItem";
import { Cart } from "./entities/Cart";
import { CartItem } from "./entities/CartItem";
import { Review } from "./entities/Review";

export const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database: "./dev.sqlite",
  entities: ["src/entities/**/*.ts"],
  synchronize: true,
  logging: false,
  migrations:['src/migrations/**/.ts']
});

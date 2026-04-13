import * as dotenv from "dotenv";
dotenv.config();
import { AppDataSource } from "./data.source";
import express from "express";
import AuthRouter from "./routes/auth.route";
import passport from "./utils/passport";
import cookieParser = require("cookie-parser");
import TaxonomyRouter from "./routes/taxonomy.routes";
import CartRouter from "./routes/cart.routes";
import OrderRouter from "./routes/order.routes";
import ReviewRoutes from "./routes/review.routes";
import AdminCustomerRouter from "./routes/admin.customer.routes";
import AdminProductRouter from "./routes/admin.product.route";
import ProductRouter from "./routes/product.routes";
import WishlistRouter from "./routes/wishlist.routes";
import { initOrderCron } from "./cron/order-tasks";
import path = require("path");

async function start() {
  try {
    const cors = require("cors");
    await AppDataSource.initialize();
    console.log("Database Init");
    initOrderCron();
    const app = express();
    // app.use(
    //   cors({
    //     origin: "http://localhost:4200",
    //     methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    //     allowedHeaders: ["Content-Type", "Authorization", "Cookie", "Accept"],
    //     credentials: true,
    //   }),
    // );
    // Replace your app.use(cors(...)) with this:

    app.use(
      cors({
        origin: "http://localhost:4200", // No trailing slash
        credentials: true, // MUST be true to match Angular
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
      }),
    );
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(passport.initialize());
    app.use(express.static(__dirname));
    app.use("/uploads", express.static("uploads"));
    app.use("/auth", AuthRouter);
    app.use("/taxonomy", TaxonomyRouter);
    app.use("/cart", CartRouter);
    app.use("/order", OrderRouter);
    app.use("/reviews", ReviewRoutes);
    app.use("/adminCustomer", AdminCustomerRouter);
    app.use("/adminProduct", AdminProductRouter);
    app.use("/products", ProductRouter);
    app.use("/wishlist", WishlistRouter);

    const angularDistPath = path.join(
      __dirname,
      "../../frontend/dist/frontend/browser",
    );
    app.use(express.static(angularDistPath));

    app.get("*", (req, res) => {
      res.sendFile(path.join(angularDistPath, "index.html"));
    });

    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000");
    });
  } catch (err) {
    console.log("Startup Error:", err);
  }
}
start();

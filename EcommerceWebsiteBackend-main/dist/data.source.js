"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./entities/User");
const Product_1 = require("./entities/Product");
const ProductType_1 = require("./entities/ProductType");
const SubCategory_1 = require("./entities/SubCategory");
const Category_1 = require("./entities/Category");
const Order_1 = require("./entities/Order");
const OrderItem_1 = require("./entities/OrderItem");
const Cart_1 = require("./entities/Cart");
const CartItem_1 = require("./entities/CartItem");
const Review_1 = require("./entities/Review");
const Wishlist_1 = require("./entities/Wishlist");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "better-sqlite3",
    database: "./dev.sqlite",
    entities: [
        User_1.User,
        ProductType_1.ProductType,
        Category_1.Category,
        SubCategory_1.SubCategory,
        Product_1.Product,
        Order_1.Order,
        OrderItem_1.OrderItem,
        Cart_1.Cart,
        CartItem_1.CartItem,
        Review_1.Review,
        Wishlist_1.Wishlist
    ],
    synchronize: true,
    logging: false,
});

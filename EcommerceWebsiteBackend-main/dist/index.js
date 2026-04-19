"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const data_source_1 = require("./data.source");
const express_1 = __importDefault(require("express"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const passport_1 = __importDefault(require("./utils/passport"));
const cookieParser = require("cookie-parser");
const taxonomy_routes_1 = __importDefault(require("./routes/taxonomy.routes"));
const cart_routes_1 = __importDefault(require("./routes/cart.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const review_routes_1 = __importDefault(require("./routes/review.routes"));
const admin_customer_routes_1 = __importDefault(require("./routes/admin.customer.routes"));
const admin_product_route_1 = __importDefault(require("./routes/admin.product.route"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const order_tasks_1 = require("./cron/order-tasks");
const path = require("path");
const error_middleware_1 = require("./middleware/error.middleware");
async function start() {
    try {
        const cors = require("cors");
        await data_source_1.AppDataSource.initialize();
        console.log("Database Init");
        (0, order_tasks_1.initOrderCron)();
        const app = (0, express_1.default)();
        // app.use(
        //   cors({
        //     origin: "http://localhost:4200",
        //     methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        //     allowedHeaders: ["Content-Type", "Authorization", "Cookie", "Accept"],
        //     credentials: true,
        //   }),
        // );
        // Replace your app.use(cors(...)) with this:
        app.use(cors({
            origin: "http://localhost:4200", // No trailing slash
            credentials: true, // MUST be true to match Angular
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
            allowedHeaders: ["Content-Type", "Authorization"],
        }));
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({ extended: true }));
        app.use(cookieParser());
        app.use(passport_1.default.initialize());
        app.use(express_1.default.static(__dirname));
        // const uploadsDir = path.join(process.cwd(), "uploads");
        // app.use("/uploads", express.static(uploadsDir));
        // Replace your current line with this:
        app.use("/uploads", express_1.default.static(path.join(process.cwd(), "uploads")));
        app.use("/auth", auth_route_1.default);
        app.use("/taxonomy", taxonomy_routes_1.default);
        app.use("/cart", cart_routes_1.default);
        app.use("/order", order_routes_1.default);
        app.use("/reviews", review_routes_1.default);
        app.use("/adminCustomer", admin_customer_routes_1.default);
        app.use("/adminProduct", admin_product_route_1.default);
        app.use("/products", product_routes_1.default);
        app.use(error_middleware_1.globalErrorHandler);
        // const angularDistPath = path.join(
        //   __dirname,
        //   "../../frontend/dist/frontend/browser",
        // );
        // app.use(express.static(angularDistPath));
        // app.get("/{*path}", (req, res) => {
        //   res.sendFile(path.join(angularDistPath, "index.html"));
        // });
        app.listen(3000, () => {
            console.log("Server running at http://localhost:3000");
        });
    }
    catch (err) {
        console.log("Startup Error:", err);
    }
}
start();

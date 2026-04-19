"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initOrderCron = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const data_source_1 = require("../data.source");
const Order_1 = require("../entities/Order");
const initOrderCron = () => {
    // This runs every 10 minutes
    // Pattern: (minute) (hour) (day of month) (month) (day of week)
    node_cron_1.default.schedule("*/10 * * * *", async () => {
        console.log("--- Running Scheduled Order Status Update ---");
        const orderRepo = data_source_1.AppDataSource.getRepository(Order_1.Order);
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
        try {
            // Logic: Find PENDING orders older than 10 mins and make them SHIPPED
            const result = await orderRepo
                .createQueryBuilder()
                .update(Order_1.Order)
                .set({ status: Order_1.OrderStatus.SHIPPED })
                .where("status = :currentStatus", { currentStatus: "PENDING" })
                .andWhere("createdAt <= :time", { time: tenMinutesAgo })
                .execute();
            console.log(`Successfully updated ${result.affected} orders.`);
        }
        catch (error) {
            console.error("Error in Order Cron Job:", error);
        }
    });
};
exports.initOrderCron = initOrderCron;

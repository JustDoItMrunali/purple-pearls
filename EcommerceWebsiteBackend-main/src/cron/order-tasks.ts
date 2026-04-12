import cron from "node-cron";
import { AppDataSource } from "../data.source";
import { Order, OrderStatus } from "../entities/Order";
import { LessThan } from "typeorm";

export const initOrderCron = () => {
  // This runs every 10 minutes
  // Pattern: (minute) (hour) (day of month) (month) (day of week)
  cron.schedule("*/10 * * * *", async () => {
    console.log("--- Running Scheduled Order Status Update ---");

    const orderRepo = AppDataSource.getRepository(Order);
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    try {
      // Logic: Find PENDING orders older than 10 mins and make them SHIPPED
      const result = await orderRepo
        .createQueryBuilder()
        .update(Order)
        .set({ status: OrderStatus.SHIPPED })
        .where("status = :currentStatus", { currentStatus: "PENDING" })
        .andWhere("createdAt <= :time", { time: tenMinutesAgo })
        .execute();

      console.log(`Successfully updated ${result.affected} orders.`);
    } catch (error) {
      console.error("Error in Order Cron Job:", error);
    }
  });
};

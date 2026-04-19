"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "better-sqlite3",
    database: "./dev.sqlite",
    entities: ["src/entities/**/*.ts"],
    synchronize: true,
    logging: false,
    migrations: ['src/migrations/**/.ts']
});

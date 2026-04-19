"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserColumns1775715422256 = void 0;
class UpdateUserColumns1775715422256 {
    constructor() {
        this.name = 'UpdateUserColumns1775715422256';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "temporary_user" ("user_id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "email" varchar(254) NOT NULL, "passwordHash" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "role" varchar CHECK( "role" IN ('user','admin') ) NOT NULL DEFAULT ('user'), "isLocked" boolean NOT NULL DEFAULT (0), "address" varchar NOT NULL, "phone" integer NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "temporary_user"("user_id", "name", "email", "passwordHash", "createdAt", "role", "isLocked") SELECT "user_id", "name", "email", "passwordHash", "createdAt", "role", "isLocked" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        await queryRunner.query(`CREATE TABLE "user" ("user_id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "email" varchar(254) NOT NULL, "passwordHash" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "role" varchar CHECK( "role" IN ('user','admin') ) NOT NULL DEFAULT ('user'), "isLocked" boolean NOT NULL DEFAULT (0), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "user"("user_id", "name", "email", "passwordHash", "createdAt", "role", "isLocked") SELECT "user_id", "name", "email", "passwordHash", "createdAt", "role", "isLocked" FROM "temporary_user"`);
        await queryRunner.query(`DROP TABLE "temporary_user"`);
    }
}
exports.UpdateUserColumns1775715422256 = UpdateUserColumns1775715422256;

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Complaint = exports.ComplaintStatus = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
var ComplaintStatus;
(function (ComplaintStatus) {
    ComplaintStatus["OPEN"] = "open";
    ComplaintStatus["IN_PROGRESS"] = "in_progress";
    ComplaintStatus["RESOLVED"] = "resolved";
})(ComplaintStatus || (exports.ComplaintStatus = ComplaintStatus = {}));
let Complaint = class Complaint {
};
exports.Complaint = Complaint;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Complaint.prototype, "complaint_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Complaint.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], Complaint.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "simple-enum",
        enum: ComplaintStatus,
        default: ComplaintStatus.OPEN,
    }),
    __metadata("design:type", String)
], Complaint.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", Object)
], Complaint.prototype, "adminResponse", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Complaint.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Complaint.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, { nullable: false, onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", User_1.User)
], Complaint.prototype, "user", void 0);
exports.Complaint = Complaint = __decorate([
    (0, typeorm_1.Entity)("complaint")
], Complaint);

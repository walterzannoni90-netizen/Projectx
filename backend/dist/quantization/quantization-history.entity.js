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
exports.QuantizationHistory = exports.QuantizationStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const quantization_entity_1 = require("./quantization.entity");
var QuantizationStatus;
(function (QuantizationStatus) {
    QuantizationStatus["IDLE"] = "idle";
    QuantizationStatus["RUNNING"] = "running";
    QuantizationStatus["COMPLETED"] = "completed";
    QuantizationStatus["FAILED"] = "failed";
})(QuantizationStatus || (exports.QuantizationStatus = QuantizationStatus = {}));
let QuantizationHistory = class QuantizationHistory {
};
exports.QuantizationHistory = QuantizationHistory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], QuantizationHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quantization_id' }),
    __metadata("design:type", String)
], QuantizationHistory.prototype, "quantizationId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => quantization_entity_1.Quantization),
    (0, typeorm_1.JoinColumn)({ name: 'quantization_id' }),
    __metadata("design:type", quantization_entity_1.Quantization)
], QuantizationHistory.prototype, "quantization", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], QuantizationHistory.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], QuantizationHistory.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cycle_number' }),
    __metadata("design:type", Number)
], QuantizationHistory.prototype, "cycleNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 20, scale: 8 }),
    __metadata("design:type", Number)
], QuantizationHistory.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'return_amount', type: 'decimal', precision: 20, scale: 8 }),
    __metadata("design:type", Number)
], QuantizationHistory.prototype, "returnAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'yield_percent', type: 'decimal', precision: 10, scale: 6 }),
    __metadata("design:type", Number)
], QuantizationHistory.prototype, "yieldPercent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: QuantizationStatus }),
    __metadata("design:type", String)
], QuantizationHistory.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'completed_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], QuantizationHistory.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], QuantizationHistory.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], QuantizationHistory.prototype, "createdAt", void 0);
exports.QuantizationHistory = QuantizationHistory = __decorate([
    (0, typeorm_1.Entity)('quantization_history')
], QuantizationHistory);
//# sourceMappingURL=quantization-history.entity.js.map
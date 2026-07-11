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
exports.Profile = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
let Profile = class Profile {
};
exports.Profile = Profile;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Profile.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], Profile.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, (user) => user.profile),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Profile.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'full_name', length: 255, nullable: true }),
    __metadata("design:type", String)
], Profile.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'avatar_url', nullable: true }),
    __metadata("design:type", String)
], Profile.prototype, "avatarUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Profile.prototype, "bio", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 10, default: 'it' }),
    __metadata("design:type", String)
], Profile.prototype, "language", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, default: 'light' }),
    __metadata("design:type", String)
], Profile.prototype, "theme", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'notifications_enabled', default: true }),
    __metadata("design:type", Boolean)
], Profile.prototype, "notificationsEnabled", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email_notifications', default: true }),
    __metadata("design:type", Boolean)
], Profile.prototype, "emailNotifications", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'push_notifications', default: true }),
    __metadata("design:type", Boolean)
], Profile.prototype, "pushNotifications", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Profile.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Profile.prototype, "updatedAt", void 0);
exports.Profile = Profile = __decorate([
    (0, typeorm_1.Entity)('profiles')
], Profile);
//# sourceMappingURL=profile.entity.js.map
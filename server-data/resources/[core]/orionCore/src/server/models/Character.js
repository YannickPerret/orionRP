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
exports.Character = exports.UserGender = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Inventory_1 = require("./Inventory");
var UserGender;
(function (UserGender) {
    UserGender["MALE"] = "male";
    UserGender["FEMALE"] = "female";
})(UserGender || (exports.UserGender = UserGender = {}));
let Character = class Character {
};
exports.Character = Character;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Character.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Character.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Character.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Character.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: UserGender,
        default: UserGender.MALE,
    }),
    __metadata("design:type", String)
], Character.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Character.prototype, "model", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], Character.prototype, "appearance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], Character.prototype, "clothes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], Character.prototype, "weapons", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 500 }),
    __metadata("design:type", Number)
], Character.prototype, "money", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Character.prototype, "bank", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-json' }),
    __metadata("design:type", Object)
], Character.prototype, "position", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 100 }),
    __metadata("design:type", Number)
], Character.prototype, "hunger", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 100 }),
    __metadata("design:type", Number)
], Character.prototype, "thirst", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 100 }),
    __metadata("design:type", Number)
], Character.prototype, "health", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], Character.prototype, "armor", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Character.prototype, "isDead", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Character.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, user => user.characters),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", User_1.User)
], Character.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Inventory_1.Inventory, inventory => inventory.character, { cascade: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Inventory_1.Inventory)
], Character.prototype, "inventory", void 0);
exports.Character = Character = __decorate([
    (0, typeorm_1.Entity)('characters')
], Character);

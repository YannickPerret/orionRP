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
exports.Inventory = void 0;
const typeorm_1 = require("typeorm");
const Character_1 = require("./Character");
const InventoryItem_1 = require("./InventoryItem");
let Inventory = class Inventory {
};
exports.Inventory = Inventory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Inventory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], Inventory.prototype, "weight", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Character_1.Character, character => character.inventory),
    __metadata("design:type", Character_1.Character)
], Inventory.prototype, "character", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => InventoryItem_1.InventoryItem, item => item.inventory, { cascade: true }),
    __metadata("design:type", Array)
], Inventory.prototype, "items", void 0);
exports.Inventory = Inventory = __decorate([
    (0, typeorm_1.Entity)('inventories')
], Inventory);

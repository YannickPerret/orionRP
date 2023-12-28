const MAX_WEIGHT = 10000;
const MAX_HEIGHT_WITH_BAG = 250;
const { db, r } = require('../core/server/database.js');
const { v4: uuidv4 } = require('uuid');
const { Item } = require('./item.js');

class Inventory {
    constructor({ id, maxWeight, items }) {
        this.id = id || uuidv4();
        this.maxWeight = maxWeight;
        this.items = items || [];
        this.weight = 0;
    }

    addItem(item, number, metadata = {}) {
        if (this.weight + item.weight > this.maxWeight) {
            return false;
        }

        if (this.hasItem(item)) {
            this.items = this.items.map(i => {
                if (i.id === item.id) {
                    i.number += number;
                }
                return i;
            });
        } else {
            this.items.push({ itemId: item.id, quantity: number, metadata: metadata });
        }

        this.weight += item.weight * number;

        return true;
    }

    removeItem(itemId, quantity = 1) {
        const item = this.items.find(i => i.id === itemId);
        if (item) {
            item.quantity -= quantity;

            if (item.quantity <= 0) {
                this.items = this.items.filter(i => i.id !== itemId);
            }
            this.calculateWeight();
        }
    }


    hasItem(item) {
        return this.items.some(i => i.id === item.id);
    }

    async getItem(itemId) {
        const item = await Item.getById(itemId);
        item.quantity = this.items.find(i => i.id === itemId).quantity;
        return item
    }

    async calculateWeight() {
        const fullItems = await this.getFullItems();
        this.weight = fullItems.reduce((totalWeight, item) => {
            return totalWeight + (item.weight * item.quantity);
        }, 0);
    }

    /**
     * Récupère les détails complets des objets dans l'inventaire.
     * @returns {Promise<Item[]>} Une promesse résolue avec un tableau d'objets `Item`.
     */
    async getFullItems() {
        const fullItems = await Promise.all(this.items.map(async (item) => {
            const itemDetails = await Item.getById(item.id);
            return {
                ...itemDetails,
                quantity: item.quantity
            };
        }));
        return fullItems;
    }

    static createEmpty() {
        return new Inventory({ maxWeight: MAX_WEIGHT, items: [] });
    }

    static async getById(id) {
        const inventoryDB = await db.get('inventories', id);
        const inventory = new Inventory({ id: inventoryDB.id, maxWeight: inventoryDB.maxWeight, items: inventoryDB.items });
        inventory.calculateWeight();
        return inventory;
    }

    async save() {
        if (await db.get('inventories', this.id)) {
            return await db.update('inventories', this);
        } else {
            return await db.insert('inventories', this);
        }
    }
}

module.exports = Inventory
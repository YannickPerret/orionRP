const MAX_WEIGHT = 10000;
const MAX_HEIGHT_WITH_BAG = 250;
const { db, r } = require('../core/server/database.js');
const { v4: uuidv4 } = require('uuid');

/*
    items : [
       {id: fidjfis-sdfjsifos, itemId: podsfksdf_sofofp, quantity: 1, metadata: { consumptions: 1}},
       {id: fidjfis-sdfjfgfgfos, itemId: podfdggfksdf_sofofp, quantity: 1, metadata: { consumptions: 1},
       {id: fidjfis-sdffdgggfgfos, itemId: podfssadaddggfksdf_sofofp, quantity: 1, metadata: { consumptions: 1}},
    ]

*/

class Inventory {
    constructor({ id, maxWeight, items }) {
        this.id = id || uuidv4();
        this.maxWeight = maxWeight;
        this.items = items || [];
        this.weight = 0;
    }

    addItem(item, number) {
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
            this.items.push({ id: item.id, quantity: number });
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


class Item {
    constructor({ id, name, label, weight, type, ammotype, image, unique, useable, description }) {
        this.id = id;
        this.name = name;
        this.label = label || '';
        this.weight = weight;
        this.description = description;
        this.useable = useable || false;
        this.type = type || 'item_standard';
        this.ammotype = ammotype || null;
        this.image = image || null;
        this.unique = unique || false;
    }

    static createNew(id, name, weight, description, usable, usableData) {
        return new this({ id, name, weight, description, usable, usableData });
    }

    static async getById(id) {
        const itemDB = await db.get('items', id);
        return new this(itemDB);
    }

    static async getByName(name) {
        const itemDB = await db.get('items', { name });
        return new this(itemDB);
    }

    static async getAll() {
        const itemsDB = await db.getAll('items');
        return itemsDB.map(itemDB => this.fromJSON(itemDB));
    }
}

class UsableItem extends Item {
    constructor({ id, name, label, weight, type, ammotype, image, unique, useable, description, shouldClose, animation, consumption }) {
        super({ id, name, label, weight, type, ammotype, image, unique, useable, description });

        this.consumption = consumption || null;
        this.animation = animation || [];
        this.shouldClose = shouldClose || false;
    }
}

module.exports = {
    Inventory,
    Item,
    UsableItem,
};
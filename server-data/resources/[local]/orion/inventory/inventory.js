const MAX_WEIGHT = 100;
const MAX_HEIGHT_WITH_BAG = 250;
const { db, r } = require('../core/server/database.js');

class Inventory {
    constructor({ id, maxWeight, items }) {
        this.id = id;
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
            this.items.push({ id: item.id, number: number });
        }

        this.weight += item.weight * number;
        return true;
    }

    removeItem(item) {
        this.items = this.items.filter(i => i.id !== item.id);
        this.weight -= item.weight;
    }

    hasItem(item) {
        return this.items.some(i => i.id === item.id);
    }

    getItems() {
        return this.items;
    }

    getWeight() {
        return this.weight;
    }

    getMaxWeight() {
        return this.maxWeight;
    }

    calculateWeight() {
        this.weight = this.items.reduce((acc, item) => acc + item.weight, 0);
    }

    static fromJSON(json) {
        return new Inventory(json);
    }

    static createEmpty() {
        return new Inventory({ id: r.uuid(), maxWeight: MAX_WEIGHT, items: [] });
    }

    static async getById(id) {
        const inventoryDB = await db.get('inventories', id);
        const inventory = new Inventory(inventoryDB);
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
    constructor({ id, name, label, weight, type, ammotype, image, unique, useable, description, shouldClose }) {
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
        this.shouldClose = shouldClose || false;
    }

    use() {
        if (!this.useable) {
            return;
        }

        emitNet('orion:inventory:useItem', this.id);
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            weight: this.weight,
            description: this.description,
            usable: this.usable,
            usableData: this.usableData
        };
    }

    static fromJSON(json) {
        return new Item(json);
    }

    static createNew(id, name, weight, description, usable, usableData) {
        return new Item({ id, name, weight, description, usable, usableData });
    }
}

class UsableItem extends Item {
    constructor({ id, name, weight, description, usable, usableData }) {
        super({ id, name, weight, description, usable, usableData });
    }

    create() {
        emitNet('orion:inventory:createUsableItem', this.toJSON());
    }

    destroy() {
        emitNet('orion:inventory:removeUsableItem', this.id);
    }
}

module.exports = {
    Inventory,
    Item,
    UsableItem,
};
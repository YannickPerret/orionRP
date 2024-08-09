const { db, r } = require('../core/server/database.js');

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

    isUnique() {
        return this.unique;
    }

    static createNew(id, name, weight, description, usable, usableData) {
        return new this({ id, name, weight, description, usable, usableData });
    }

    static async getById(id) {
        const itemDB = await db.getById('items', id);
        return new this(itemDB);
    }

    static async getByName(name) {
        const itemDB = await db.get('items', 'name', name);
        return new this(itemDB);
    }

    static async getAll() {
        const itemsDB = await db.getAll('items');
        return itemsDB.map(itemDB => this.fromJSON(itemDB));
    }
}
class UsableItem extends Item {
    constructor({ id, name, label, weight, type, ammotype, image, unique, useable, description, shouldClose, animation, hunger, thirst, expiration }) {
        super({ id, name, label, weight, type, ammotype, image, unique, useable, description });

        this.animation = animation || {};
        this.shouldClose = shouldClose || false;
        this.hunger = hunger || null;
        this.thirst = thirst || null;
        this.expiration = expiration || 0;
        this.expirationDate = this.expiration !== 0 ? new Date(this.expiration) : null;
    }

    isExpired() {
        if (this.expiration === 0) return false;
        return new Date() > this.expirationDate;
    }
}
module.exports = { Item, UsableItem };
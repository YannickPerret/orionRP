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

    static createNew(id, name, weight, description, usable, usableData) {
        return new this({ id, name, weight, description, usable, usableData });
    }

    static async getById(id) {
        const itemDB = await db.getById('items', id);
        return new this(itemDB);
    }

    static async getByName(name) {
        const itemDB = await db.getByWithFilter('items', { name: name });
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
        this.animation = animation || {};
        this.shouldClose = shouldClose || false;
    }
}
module.exports = { Item, UsableItem };
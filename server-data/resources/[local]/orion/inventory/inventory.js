class Inventory {
    constructor({ id, maxWeight, maxSlots, items }) {
        this.id = id;
        this.maxWeight = maxWeight;
        this.items = items || [];
        this.weight = 0;
    }

    addItem(item) {
        if (this.weight + item.weight > this.maxWeight) {
            return false;
        }

        this.items.push(item);
        this.weight += item.weight;
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

    toJSON() {
        return {
            id: this.id,
            maxWeight: this.maxWeight,
            maxSlots: this.maxSlots,
            items: this.items
        };
    }

    static fromJSON(json) {
        return new Inventory(json);
    }

    static create(id, maxWeight, maxSlots) {
        return new Inventory({ id, maxWeight, maxSlots });
    }
}


class Item {
    constructor({ id, name, weight, description, usable, usableData }) {
        this.id = id;
        this.name = name;
        this.weight = weight;
        this.description = description;
        this.usable = usable || false;
        this.usableData = usableData;
    }

    use() {
        if (!this.usable) {
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

    static create(id, name, weight, description, usable, usableData) {
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
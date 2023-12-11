class Invoice {
    constructor(id, name, playerId, targetId, price) {
        this.id = id;
        this.name = name;
        this.playerId = playerId;
        this.targetId = targetId;
        this.price = price;
        this.isPaid = false;
    }

    async save() {
        let result;
        if (await db.get('invoices', this.id)) {
          result = await db.update('invoices', this);
        } else {
          result = await db.insert('invoices', this);
        }
        return result;
    }
}
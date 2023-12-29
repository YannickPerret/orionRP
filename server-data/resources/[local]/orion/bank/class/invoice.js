class Invoice {

  constructor(id, playerId, targetId, price) {
    this.id = id;
    this.playerId = playerId;
    this.targetId = targetId;
    this.price = price;
    this.isPaid = false;
    this.dateEmission = new Date();
  }

  paid(value) {
    if (value) {
      this.isPaid = true;
      this.datePayment = new Date();
    }
    else {
      this.isPaid = false;
    }
  }

  async save() {
    let result;
    if (await db.getById('invoices', this.id)) {
      result = await db.update('invoices', this);
    } else {
      result = await db.insert('invoices', this);
    }
    return result;
  }
}

module.exports = Invoice;
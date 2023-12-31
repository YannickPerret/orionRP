const { db, r } = require('../../core/server/database.js');
const { v4: uuid } = require('uuid');

class Account {
    constructor({ id, balance, owner, observer, freeze, history, cardId }) {
        this.id = id || uuid();
        this.balance = balance;
        this.playerId = owner;
        this.observer = new Map(observer) || new Map();
        this.freeze = freeze || false;
        this.history = history || [];
        this.cardId = cardId || null;
        this.maxCardWithdraw = 10000;
    }

    static async getById(id) {
        const accountDB = await db.getById('accounts', id);
        return new Account(accountDB);
    }

    setNewCardId(cardId) {
        this.cardId = cardId;
    }
    async save() {
        let result;
        if (await db.getById('accounts', this.id)) {
            result = await db.update('accounts', this);
        } else {
            result = await db.insert('accounts', this);
        }
        return result;
    }
}

module.exports = Account;
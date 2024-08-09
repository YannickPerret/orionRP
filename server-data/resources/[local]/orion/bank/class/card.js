const { db, r } = require('../../core/server/database.js');
const { v4: uuid } = require('uuid');

class Card {
    constructor({ id, accountId, code }) {
        this.id = id || uuid();
        this.accountId = accountId;
        this.code = code;
    }

    getAccountId() {
        return this.accountId;
    }

    setAccountId(accountId) {
        this.accountId = accountId;
    }

    getCode() {
        return this.code;
    }

    setCode(code) {
        if (code.length <= 6 && code.length > 0) {
            this.code = code;
        }
    }

    static async getById(id) {
        const cardDB = await db.getById('cards', id);
        return new Card(cardDB);
    }

    static getRandomCode() {
        return Math.floor(Math.random() * 1000);
    }


    async save() {
        let result;
        if (await db.getById('cards', this.id)) {
            result = await db.update('cards', this);
        } else {
            result = await db.insert('cards', this);
        }
        return result;
    }
}

module.exports = Card;
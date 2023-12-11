class Card {
    constructor(id, accountId, code) {
        this.id = id;
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

    async save() {
        let result;
        if (await db.get('cards', this.id)) {
          result = await db.update('cards', this);
        } else {
          result = await db.insert('cards', this);
        }
        return result;
    }
}

module.exports = Card;
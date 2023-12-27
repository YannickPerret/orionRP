class Account {
    constructor(id, balance, owner, observer, freeze, history, cardId) {
        this.id = id;
        this.balance = balance;
        this.playerId = owner;
        this.observer = new Map(observer);
        this.freeze = freeze;
        this.history = history;
        this.cardId = cardId;
        this.maxCardWithdraw = 10000;
    }

    getBalance() {
        return this.balance;
    }

    setBalance(balance) {
        this.balance += balance;
    }

    getOwner() {
        return this.owner;
    }

    setOwner(owner) {
        this.owner = owner;
    }

    getObserver() {
        return this.observer;
    }

    setObserver(observer) {
        this.observer = observer;
    }

    getFreeze() {
        return this.freeze;
    }

    setFreeze(freeze) {
        this.freeze = freeze;
    }

    getcardId() {
        return this.cardId;
    }

    setNewCardId(cardId) {
        this.cardId = cardId;
    }
    async save() {
        let result;
        if (await db.get('accounts', this.id)) {
            result = await db.update('accounts', this);
        } else {
            result = await db.insert('accounts', this);
        }
        return result;
    }
}

module.exports = Account;
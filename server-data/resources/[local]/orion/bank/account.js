class Account {
    constructor(id, balance, owner, observer, freeze, history, cardId) {
        this.id = id || uuidv4();
        this.balance = balance;
        this.owner = owner;
        this.observer = new Map(observer);
        this.freeze = freeze;
        this.history = history;
        this.cardId = cardId;
    }

    getBalance() {
        return this.balance;
    }

    setBalance(balance) {
        this.balance = balance;
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
}

module.exports = Account;
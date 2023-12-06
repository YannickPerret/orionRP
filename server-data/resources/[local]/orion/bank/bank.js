class Bank {
    constructor(config) {
        this.name = config.name;
        this.position = config.position;
        this.blip = config.blip;
        this.type = config.type;
        this.currentAmount = config.currentAmount;
        this.maxAmount = config.maxAmount;
    }

    init () {
        this.blip = CreateBlip(this.blip.sprite, this.position, this.blip.scale, this.blip.color, this.blip.name, this.blip.shortRange);
    }

    
}

module.exports = Bank;
class BlipsManager {
    constructor() {
        this.blips = new Map();
    }

    addBlip(id, blip) {
        this.blips.set(id, blip);
    }

    addBlips(blips) {
        blips.forEach(blip => {
            this.blips.set(blip.id, blip);
        });
    }

    removeBlip(id) {
        this.blips.delete(id);
    }

    getBlips() {
        return this.blips;
    }

    getBlipById(id) {
        return this.blips.get(id);
    }

    getBlipByName(name) {
        return this.blips.find(blip => blip.name === name);
    }

}

module.exports = new BlipsManager();
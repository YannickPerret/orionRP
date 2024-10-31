const { RoleType } = require('../models/Role.js');

class PlayerManagerService {
    constructor() {
        this.players = new Map();
    }

    addPlayer(playerId, user) {
        this.players.set(playerId, user);
    }

    removePlayer(playerId) {
        this.players.delete(playerId);
    }

    isAdmin(playerId) {
        const player = this.players.get(playerId);
        return player && player.role && player.role.name === RoleType.ADMIN;
    }

    getPlayer(playerId) {
        return this.players.get(playerId);
    }

    getAllPlayers() {
        return this.players;
    }
}

module.exports = new PlayerManagerService();

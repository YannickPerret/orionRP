class PlayerManager {
  constructor() {
    this.players = new Map();
  }

  addPlayer(source, player) {
    this.players.set(source, player);
  }

  removePlayer(source) {
    this.players.delete(source);
  }

  getPlayerBySource(source) {
    return this.players.has(source) ? this.players.get(source) : null;
  }

  getPlayers() {
    return this.players;
  }
}

const playerManager = new PlayerManager();
module.exports = playerManager;

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
    console.log(source);
    return this.players.get(source);
  }

  getPlayers() {
    return this.players;
  }
}

const playerManager = new PlayerManager();
module.exports = playerManager;

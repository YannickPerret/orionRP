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
    return this.players.get(source);
  }
}

export default new PlayerManager();

const PlayerManager = require("../system/playerManager.js");

const getCurrentPlayerBySource = (source) => {
  return PlayerManager.getPlayerBySource(source);
};

module.exports = {
  getCurrentPlayerBySource,
};

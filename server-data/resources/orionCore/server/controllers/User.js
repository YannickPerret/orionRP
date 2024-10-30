const AppDataSource = require('../databases/database.js');
const inventoryController = require('./Inventory.js');

module.exports = {
  async handleUserConnecting(playerId, name, deferrals) {
    try {
      const identifier = getPlayerIdentifier(playerId);
      const userRepository = AppDataSource.getRepository('User');

      let user = await userRepository.findOne({
        where: { identifier },
        relations: ['inventory'],
      });

      if (!user) {
        // Créer un nouvel utilisateur avec des informations initiales
        user = userRepository.create({
          identifier,
          name,
          email: '',
          password: '', // À renseigner lors de l'enregistrement
          username: name,
        });

        // Créer l'inventaire de l'utilisateur
        user.inventory = await inventoryController.createInventory();
        await userRepository.save(user);
      }

      deferrals.done();
    } catch (error) {
      console.log('Erreur lors de la connexion de l\'utilisateur:', error);
      deferrals.done('Erreur lors de la connexion au serveur.');
    }
  },

  async handleUserDropped(playerId, reason) {
    try {
      const identifier = getPlayerIdentifier(playerId);
      const userRepository = AppDataSource.getRepository('User');
      let user = await userRepository.findOne({ where: { identifier } });

      if (user) {
        await userRepository.save(user);
      }
    } catch (error) {
      console.log('Erreur lors de la déconnexion de l\'utilisateur:', error);
    }
  },
};

function getPlayerIdentifier(playerId) {
  for (let i = 0; i < GetNumPlayerIdentifiers(playerId); i++) {
    const identifier = GetPlayerIdentifier(playerId, i);
    if (identifier.includes('license:')) {
      return identifier;
    }
  }
  return null;
}

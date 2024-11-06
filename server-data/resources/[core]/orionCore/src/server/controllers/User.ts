const AppDataSource = require('../databases/database.ts');
const PlayerManagerService = require('../services/PlayerManagerServices.js');
const { saveCharacter } = require('./Character.ts')

module.exports = {
  isAdmin(playerId) {
    return PlayerManagerService.isAdmin(playerId);
  },

  async assignRoleToUser(userId, roleName) {
    const userRepository = AppDataSource.getRepository('User');
    const roleRepository = AppDataSource.getRepository('Role');

    const user = await userRepository.findOne({ where: { id: userId } });
    const role = await roleRepository.findOne({ where: { name: roleName } });

    if (user && role) {
      user.role = role;
      await userRepository.save(user);
      console.log(`Rôle ${roleName} assigné à l'utilisateur ${user.username}`);
      return true;
    }
    console.log('Utilisateur ou rôle introuvable');
    return false;
  },

  async handleUserConnecting(playerId, name, deferrals) {
    try {
      const identifier = getPlayerIdentifier(playerId);
      const userRepository = AppDataSource.getRepository('User');

      let user = await userRepository.findOne({
        where: { identifier },
        relations: ['role'],
      });

      if (!user) {
        deferrals.done('Vous n\'êtes pas enregistré sur la whitelist.');
        return;
      }

      console.log(`Utilisateur ${user.role.name}:${name} connecté avec succès`);
      deferrals.update(`Bienvenue, ${name}. Connexion en cours...`);
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
        userRepository.position = GetEntityCoords(playerId);
        await userRepository.save(user);
      }
      await saveCharacter(playerId);
      PlayerManagerService.removePlayer(playerId);

    } catch (error) {
      console.log('Erreur lors de la déconnexion de l\'utilisateur:', error);
    }
  },
};

function getPlayerIdentifier(playerId) {
  for (let i = 0; i < GetNumPlayerIdentifiers(playerId); i++) {
    const identifier = GetPlayerIdentifier(playerId, i);
    if (identifier.includes('licence:')) {
      return identifier;
    }
  }
  return null;
}

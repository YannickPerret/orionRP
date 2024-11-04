const AppDataSource = require('../databases/database.js');
const User = require("../models/User");
const Character = require("../models/Character");
const PlayerManagerService = require("../services/PlayerManagerServices");

module.exports = {
  async registerCharacter(identifier, characterData) {
    const userRepository = AppDataSource.getRepository(User);
    const characterRepository = AppDataSource.getRepository(Character);

    try {
      const user = await userRepository.findOne({ where: { identifier } });

      if (!user) {
        throw new Error(`Utilisateur avec l'identifiant ${identifier} introuvable`);
      }

      const newCharacter = characterRepository.create({
        userId: user.id,
        firstName: characterData.firstName,
        lastName: characterData.lastName,
        model: characterData.model,
        appearance: characterData.appearance,
        clothes: characterData.clothes,
        position: {x: config.character.spawnPosition.x, y:config.character.spawnPosition.y, z:config.character.spawnPosition.z},
      });

      await characterRepository.save(newCharacter);

      user.activeCharacter = newCharacter.id;
      await userRepository.save(user);
      console.log(`Personnage ${newCharacter.firstName} ${newCharacter.lastName}  enregistré pour l'utilisateur ${user.username}`);
      return user;
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du personnage:', error);
      throw error;
    }
  },

  loadCharacter(playerId, character) {
    emitNet('orionCore:client:loadCharacter', playerId, {
      model: character.model,
      appearance: character.appearance,
      clothes: character.clothes,
      weapons: character.weapons,
      position: character.position,
      jobs: character.jobs
    });
  },

  async decreaseCharacterNeeds() {
    const characterRepository = AppDataSource.getRepository('Character');
    const characters = await characterRepository.find();

    for (let character of characters) {
      character.hunger = Math.max(0, character.hunger - 0.5);
      character.thirst = Math.max(0, character.thirst - 0.5);
      await characterRepository.save(character);

      if (character.hunger === 0 || character.thirst === 0) {
        emitNet('core:reduceCharacterHealth', character.id, 5);
      }
    }
  },

  async applyItemEffects(characterId, effects) {
    const characterRepository = AppDataSource.getRepository('Character');
    let character = await characterRepository.findOne({ where: { id: characterId } });

    if (character) {
      for (let effect of effects) {
        if (character.hasOwnProperty(effect.type)) {
          character[effect.type] = Math.min(100, character[effect.type] + effect.amount);
        }
      }
      await characterRepository.save(character);
      emitNet('core:updateCharacterNeeds', characterId, character);
    }
  },

  async loginToCharacter(playerId, identifier) {
    if (!playerId) throw new Error('Erreur: `playerId` est null ou non défini');
    if (!identifier) throw new Error(`Erreur: identifiant introuvable pour le playerId ${playerId}`);

    try {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: { identifier },
        relations: ['characters', 'role'],
      });

      if (user && user.activeCharacter) {
        const characterRepository = AppDataSource.getRepository(Character);
        const character = await characterRepository.findOne({ where: { id: user.activeCharacter } });
        if (character) {
          PlayerManagerService.addPlayer(playerId, user);
          return character;
        }
      }
      throw new Error(`Aucun personnage actif trouvé pour l'utilisateur ${user ? user.username : 'inconnu'}`);
    } catch (error) {
      console.error('Erreur lors de la récupération des données du personnage:', error);
      throw error;
    }
  },
};

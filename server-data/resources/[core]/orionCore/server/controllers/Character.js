const AppDataSource = require('../databases/database.js');
const User = require("../models/User");
const Character = require("../models/Character");
const PlayerManagerService = require("../services/PlayerManagerServices");

module.exports = {
  async createCharacter(userId, characterData) {
    const characterRepository = AppDataSource.getRepository('Character');

    const character = characterRepository.create({
      ...characterData,
      userId,
      hunger: 100,
      thirst: 100,
      health: 100,
      armor: 0,
      money: 0,
      bank: 0,
      appearance: characterData.appearance || {},
      habits: characterData.habits || {},
      position: characterData.position || { x: 0, y: 0, z: 0 },
    });

    await characterRepository.save(character);
    return character;
  },

  async loadCharacter(playerId, character) {
    const { x, y, z } = character.position || { x: 0, y: 0, z: 0 };

    // Émettre les données de personnage vers le client pour l'appliquer
    emitNet('orionCore:applyCharacterData', playerId, {
      position: { x, y, z },
      model: character.model,
      appearance: character.appearance,
      clothes: character.clothes,
      weapons: character.weapons,
      money: character.money,
      bank: character.bank,
    });

    console.log(`Données de ${character.name} appliquées pour le joueur ID ${playerId}`);
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
  }
};

const AppDataSource = require('../databases/database.js');
const Character = require('../models/Character');

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
};

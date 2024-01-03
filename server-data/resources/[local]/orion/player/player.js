const { db, r } = require('../core/server/database.js');
const { v4: uuid } = require('uuid');


class Player {
  constructor({ id, source, accountId, steamId, firstname, lastname, phone, money, position, license, discord, role, mugshot, skin, inventoryId }) {
    this.id = id || uuid();
    this.source = source;
    this.steamId = steamId || '';
    this.license = license || '';
    this.discord = discord || '';
    this.accountId = accountId || false;
    this.hunger = 100;
    this.thirst = 100;
    this.fatigue = 0;
    this.inventoryId = inventoryId || '';
    this.position = {
      x: position.x || 0,
      y: position.y || 0,
      z: position.z || 0,
    };
    this.firstname = firstname;
    this.lastname = lastname;
    this.phone = phone;
    this.money = money || 500;
    this.mugshot = mugshot || '';
    this.role = role || false;
    this.skin = skin || [];
    this.jobId = false;
  }

  #isDead = false;

  get isDead() {
    return this.#isDead;
  }

  set isDead(value) {
    this.#isDead = value;
  }

  eat(value) {
    this.faim = Math.min(this.faim + value, 100);
  }

  drink(value) {
    this.soif = Math.min(this.soif + value, 100);
  }

  setAccountId(accountId) {
    this.accountId = accountId;
  }

  setMoney(money) {
    this.money = this.money + money;
  }

  async save() {
    let result;
    //if id exists in database
    if (await db.getById('players', this.id)) {
      result = await db.update('players', this);
    } else {
      result = await db.insert('players', this);
    }
    return result;
  }
}

module.exports = Player;

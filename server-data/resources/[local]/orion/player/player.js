//import Inventory from "./inventaire.js";
const db = require("../database.js");
class Player {
  constructor(
    id,
    source,
    steamId,
    firstname,
    lastname,
    phone,
    money,
    bank,
    position,
    license,
    discord
  ) {
    this.id = id;
    this.source = source;
    this.faim = 100;
    this.soif = 100;
    //this.inventaire = new Inventory();
    this.vehicules = [];
    this.steamId = steamId || null;
    this.position = {
      x: position.x || 0,
      y: position.y || 0,
      z: position.z || 0,
    };
    this.fatigue = 0;
    this.firstname = firstname;
    this.lastname = lastname;
    this.phone = phone;
    this.money = money || 500;
    this.bank = bank || 0;
    this.license = license || null;
    this.discord = discord || null;
  }

  manger(quantite) {
    this.faim = Math.min(this.faim + quantite, 100);
  }

  boire(quantite) {
    this.soif = Math.min(this.soif + quantite, 100);
  }

  diminuerFaim(value = undefined) {
    if (value) {
      this.faim = Math.max(this.faim - value, 0);
      return;
    }
    this.faim = Math.max(this.faim - 1, 0);
  }
  augmenterFaim(value = undefined) {
    if (value) {
      this.faim = Math.min(this.faim + value, 100);
      return;
    }
    this.faim = Math.min(this.faim + 1, 100);
  }

  diminuerSoif(value = undefined) {
    if (value) {
      this.soif = Math.max(this.soif - value, 0);
      return;
    }
    this.soif = Math.max(this.soif - 1, 0);
  }
  augmenterSoif(value = undefined) {
    if (value) {
      this.soif = Math.min(this.soif + value, 100);
      return;
    }
    this.soif = Math.min(this.soif + 1, 100);
  }

  async save() {
    await db
      .getConnection()
      .table("players")
      .get(this.id)
      .update({
        position: this.position,
        money: this.money,
        bank: this.bank,
        firstname: this.firstname,
        lastname: this.lastname,
        phone: this.phone,
      })
      .run();
  }
}

module.exports = Player;

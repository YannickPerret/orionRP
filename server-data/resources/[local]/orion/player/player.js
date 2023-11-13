const { db, r } = require("../system/database.js");
const Inventory = require("../inventory/Inventory.js");
class Player {
  constructor({
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
    discord,
    isAdmin,
    mugshot,
    isDead,
  }) {
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
    this.mugshot = mugshot || "";
    this.license = license || null;
    this.discord = discord || null;
    this.isAdmin = isAdmin || false;
    this.isDead = isDead || false;
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
    const playerData = {
      id: this.id,
      steamId: this.steamId,
      license: this.license,
      firstname: this.firstname,
      lastname: this.lastname,
      phone: this.phone,
      money: this.money,
      bank: this.bank,
      position: this.position,
      discord: this.discord,
      mugshot: this.mugshot,
    };
    const result = await db.update("players", playerData);
    if (result.changes && result.changes.length > 0) {
      console.log("[Orion] Joueur sauvegardé : ", this);
    }
  }
}

module.exports = Player;

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
    role,
    mugshot,
    skin,
  }) {
    this.id = id;
    this.source = source;
    this.faim = 100;
    this.soif = 100;
    //this.inventaire = new Inventory();
    //this.vehicules = [];
    this.steamId = steamId || '';
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
    this.mugshot = mugshot || '';
    this.license = license || '';
    this.discord = discord || '';
    this.role = role || false;
    this.skin = skin || [];
  }

  #isDead = false;

  get isDead() {
    return this.#isDead;
  }

  set isDead(value) {
    this.#isDead = value;
  }

  manger(quantite) {
    this.faim = Math.min(this.faim + quantite, 100);
  }

  boire(quantite) {
    this.soif = Math.min(this.soif + quantite, 100);
  }

  changeFaim(value = undefined) {
    if (value) {
      this.faim = Math.max(this.faim + value, 0);
      return;
    }
    return new Error('Valeur invalide');
  }

  changeSoif(value = undefined) {
    if (value) {
      this.soif = Math.max(this.soif + value, 0);
      return;
    }
    return new Error('Valeur invalide');
  }

  async save() {
    //if id exists in database
    if (await db.get('players', this.id)) {
      const result = await db.update('players', this.id, this);
      return result;
    } else {
      const result = await db.insert('players', this);
      return result;
    }
  }
}

module.exports = Player;

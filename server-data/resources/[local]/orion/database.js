const r = require("rethinkdbdash");

class Database {
  constructor() {
    if (!Database.instance) {
      this._connection = r({
        host: "192.168.1.18", // Remplacez par votre adresse de serveur
        port: 28015, // Remplacez par le port de votre serveur RethinkDB
        db: "orion", // Nom de votre base de données
      });
      Database.instance = this;
    }

    return Database.instance;
  }

  // Méthode pour récupérer la connexion
  getConnection() {
    return this._connection;
  }
}

const db = new Database();
Object.freeze(db);

module.exports = db;

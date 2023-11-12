const r = require("rethinkdb");

class Database {
  constructor() {
    if (!Database.instance) {
      this._config = {
        host: "192.168.1.18",
        port: 28015,
        db: "orion",
      };
      Database.instance = this;
    }

    return Database.instance;
  }

  async connect() {
    if (!this._connection) {
      this._connection = await r.connect(this._config);
    }
    return this._connection;
  }
}

const db = new Database();

module.exports = { db, r };

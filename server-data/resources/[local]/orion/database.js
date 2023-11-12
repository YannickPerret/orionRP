const r = require("rethinkdb");

class Database {
  constructor(config) {
    if (!Database.instance) {
      this._config = config || {
        host: "192.168.1.18",
        port: 28015,
        db: "orion",
      };
      this._connection = null;
      Database.instance = this;
    }
    return Database.instance;
  }

  async connect() {
    if (!this._connection) {
      try {
        this._connection = await r.connect(this._config);
        this._connection.use(this._config.db);
      } catch (err) {
        console.error("Connection to RethinkDB failed:", err);
        throw err;
      }
    }
    return this._connection;
  }
}

const dbConfig = {
  host: "192.168.1.18",
  port: 28015,
  db: "orion",
};
const db = new Database(dbConfig);

module.exports = { db, r };

const r = require("rethinkdb");

let globalConnection = null;

class Database {
  constructor(config) {
    this._config = config || {
      host: "192.168.1.18",
      port: 28015,
      db: "orion",
    };
  }

  connect(callback) {
    if (!globalConnection) {
      r.connect(this._config, (err, conn) => {
        if (err) {
          console.error("Connection to RethinkDB failed:", err);
          callback(err, null);
        } else {
          conn.use(this._config.db);
          globalConnection = conn;
          console.log("Connected to RethinkDB");
          callback(null, conn);
        }
      });
    } else {
      callback(null, globalConnection);
    }
  }
}

const db = new Database({ host: "192.168.1.18", port: 28015, db: "orion" });

module.exports = { db, r };

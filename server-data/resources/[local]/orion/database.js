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

  connect() {
    return new Promise((resolve, reject) => {
      if (!this._connection) {
        r.connect(this._config, (err, conn) => {
          if (err) {
            reject(err);
          } else {
            conn.use(this._config.db);
            this._connection = conn;
            resolve(conn);
          }
        });
      } else {
        resolve(this._connection);
      }
    });
  }
}

const db = new Database({ host: "192.168.1.18", port: 28015, db: "orion" });

module.exports = { db, r };

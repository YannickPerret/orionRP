const r = require("rethinkdb");

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

  insert(table, data) {
    return this.connect().then((connection) => {
      return r
        .table(table)
        .insert(data)
        .run(connection)
        .then((result) => {
          console.log("document ajouté avec succès:", result);
          return result;
        })
        .catch((err) => {
          console.error("Erreur lors de l'insertion du document:", err);
          throw err;
        });
    });
  }

  get(table, id) {
    return this.connect().then((connection) => {
      return r
        .table(table)
        .get(id)
        .run(connection)
        .then((result) => {
          console.log("document récupéré avec succès:", result);
          return result;
        })
        .catch((err) => {
          console.error("Erreur lors de la récupération du document:", err);
          throw err;
        });
    });
  }

  update(table, data) {
    return this.connect().then((connection) => {
      return r
        .table(table)
        .get(data.id)
        .update(data)
        .run(connection)
        .then((result) => {
          console.log("document mis à jour avec succès:", result);
          return result;
        })
        .catch((err) => {
          console.error("Erreur lors de la mise à jour du document:", err);
          throw err;
        });
    });
  }

  remove(table, id) {
    return this.connect().then((connection) => {
      return r
        .table(table)
        .get(id)
        .delete()
        .run(connection)
        .then((result) => {
          console.log("document supprimé avec succès:", result);
          return result;
        })
        .catch((err) => {
          console.error("Erreur lors de la suppression du document:", err);
          throw err;
        });
    });
  }
}

const db = new Database({ host: "192.168.1.18", port: 28015, db: "orion" });

module.exports = { db, r };

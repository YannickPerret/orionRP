const r = require('rethinkdb');

class Database {
  constructor({ host, port, db }) {
    this._config = {
      host: host || '192.168.1.18',
      port: port || 28015,
      db: db || 'orion',
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

  createDb(dbName) {
    return this.connect().then(connection => {
      return r
        .dbCreate(dbName)
        .run(connection)
        .then(result => {
          console.log('Base de données créée avec succès');
          return result;
        })
        .catch(err => {
          console.error('Erreur lors de la création de la base de données:', err);
          throw err;
        });
    });
  }

  createTable(tableName) {
    //check if table exists before creating it
    return this.connect().then(connection => {
      return r
        .tableList()
        .run(connection)
        .then(list => {
          if (!list.includes(tableName)) {
            return r
              .tableCreate(tableName)
              .run(connection)
              .then(result => {
                console.log('Table créée avec succès');
                return result;
              })
              .catch(err => {
                console.error('Erreur lors de la création de la table:', err);
                throw err;
              });
          } else {
            console.log('La table existe déjà');
            return Promise.resolve();
          }
        })
        .catch(err => {
          console.error('Erreur lors de la récupération de la liste des tables:', err);
          throw err;
        });
    });
  }

  insert(table, data) {
    return this.connect().then(connection => {
      return r
        .table(table)
        .insert(data)
        .run(connection)
        .then(result => {
          return result;
        })
        .catch(err => {
          console.error("Erreur lors de l'insertion du document:", err);
          throw err;
        });
    });
  }

  get(table, id) {
    return this.connect().then(connection => {
      return r
        .table(table)
        .get(id)
        .run(connection)
        .then(result => {
          return result;
        })
        .catch(err => {
          console.error('Erreur lors de la récupération du document:', err);
          throw err;
        });
    });
  }

  getByWithFilter(table, filters) {
    return this.connect().then(connection => {
      // Construction de la requête de filtre
      let query = r.table(table);

      if (filters && Object.keys(filters).length > 0) {
        query = query.filter(doc => {
          // Créer des conditions de filtre basées sur les clés et valeurs fournies
          return Object.keys(filters)
            .map(key => {
              return doc(key).eq(filters[key]);
            })
            .reduce((left, right) => r.or(left, right));
        });
      }

      // Exécuter la requête
      return query
        .run(connection)
        .then(cursor => cursor.toArray())
        .then(results => {
          if (results.length > 0) {
            return results; // Renvoie tous les documents correspondants
          } else {
            console.log('Aucun document trouvé avec les filtres fournis.');
            return [];
          }
        })
        .catch(err => {
          console.error('Erreur lors de la recherche des documents:', err);
          throw err;
        });
    });
  }

  getFieldValues(table, field) {
    return this.connect().then(connection => {
      return r
        .table(table)
        .map(doc => doc(field))
        .run(connection)
        .then(cursor => cursor.toArray())
        .catch(err => {
          console.error(`Erreur lors de la récupération des valeurs du champ ${field}:`, err);
          throw err;
        });
    });
  }

  update(table, data) {
    return this.connect().then(connection => {
      return r
        .table(table)
        .get(data.id)
        .update(data, { nonAtomic: true })
        .run(connection)
        .then(result => {
          console.log('document mis à jour avec succès');
          return result;
        })
        .catch(err => {
          console.error('Erreur lors de la mise à jour du document:', err);
          throw err;
        });
    });
  }

  remove(table, id) {
    return this.connect().then(connection => {
      return r
        .table(table)
        .get(id)
        .delete()
        .run(connection)
        .then(result => {
          console.log('document supprimé avec succès');
          return result;
        })
        .catch(err => {
          console.error('Erreur lors de la suppression du document:', err);
          throw err;
        });
    });
  }
}

const db = new Database({ host: '127.0.0.1', port: 28015, db: 'orion' });

module.exports = { db, r };

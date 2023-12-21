const r = require('rethinkdb');
const fs = require('fs');
const path = require('path');

class Database {
  constructor({ host, port, db }) {
    this.host = host || '192.168.1.18';
    this.port = port || 28015;
    this.db = db || 'orion';
    this.connection = null;

    this.connect()
  }

  connect() {
    return new Promise((resolve, reject) => {
      if (!this._connection) {
        r.connect({ host: this.host, port: this.port, db: this.db }, (err, conn) => {
          if (err) {
            reject(err);
          } else {
            conn.use(this.db);
            this.connection = conn;
            resolve(conn);
          }
        });
      } else {
        resolve(this._connection);
      }
    });
  }

  async initializeMigration() {
    let latestVersion = 0;
    await this.createDatabase(this.db);
    await this.createTable('system').catch(async () => {
      latestVersion = await this.getLatestDbVersion();
    });
    await this.applyMigrations(latestVersion);
  }

  getLatestDbVersion() {
    return this.connect().then(connection => {
      return r.table('system').orderBy({ index: r.desc('version') }).limit(1)
        .run(connection)
        .then(cursor => cursor.toArray())
        .then(result => result.length > 0 ? result[0].version : 0)
        .catch(err => {
          console.error('Erreur lors de la récupération de la version de la base de données:', err);
          throw err;
        });
    });
  }

  async applyMigrations(currentVersion) {
    const migrationFiles = fs.readdirSync(path.join(__dirname, 'migrations'))
      .filter(file => file.endsWith('.js'))
      .map(file => require(`./migrations/${file}`))
      .sort((a, b) => a.version - b.version);

    for (const migration of migrationFiles) {
      if (migration.version > currentVersion) {
        console.log(`Applying migration: ${migration.version}`);
        await migration.migrate(this);
        await this.updateVersion(migration.version);
      }
    }
  }

  createDatabase(dbName) {
    return this.connect().then(connection => {
      return r.dbList().contains(dbName).run(connection)
        .then(exists => {
          if (!exists) {
            return r.dbCreate(dbName).run(connection)
              .then(result => {
                console.log('Base de données créée avec succès');
                return result;
              });
          } else {
            console.log('La base de données existe déjà');
            return Promise.resolve('La base de données existe déjà');
          }
        })
        .catch(err => {
          console.error('Erreur lors de la vérification ou de la création de la base de données:', err);
          throw err;
        });
    });
  }

  updateVersion(version) {
    return this.insert('system', { version, date: new Date() });
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

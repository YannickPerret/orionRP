const dbConfig = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'Suplivent27',
    database: 'orion',
    synchronize: true, // Attention : à utiliser uniquement en développement
    logging: false,
    entities: [
        './models/*.js'
    ],
    migrations: [],
    subscribers: [],
}

module.exports = {dbConfig};
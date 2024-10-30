const dbConfig = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'tchoune',
    password: 'Suplivent27',
    database: 'orion',
    synchronize: true, // Attention : à utiliser uniquement en développement
    logging: false,
    entities: [
        'server/models/*.js'
    ],
    migrations: [],
    subscribers: [],
}

module.exports = dbConfig;
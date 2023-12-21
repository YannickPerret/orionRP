const fs = require('fs');
const path = require('path');

function getNextMigrationVersion(migrationsDir) {
    const files = fs.readdirSync(migrationsDir);
    const versions = files.map(file => parseInt(file.split('_')[0], 10));
    const maxVersion = versions.length > 0 ? Math.max(...versions) : -1;
    return maxVersion + 1;
}

function createMigrationFile(name) {
    const migrationsDir = path.join(__dirname, 'core/server/migrations');
    if (!fs.existsSync(migrationsDir)) {
        fs.mkdirSync(migrationsDir);
    }

    const version = getNextMigrationVersion(migrationsDir);
    const fileName = `${version.toString().padStart(4, '0')}_${name}.js`; // Formatage du nom du fichier
    const filePath = path.join(migrationsDir, fileName);

    const content = `module.exports = {
    version: ${version},
    migrate: async (db) => {
        // your code here
    }
};`;

    fs.writeFileSync(filePath, content);
    console.log(`Migration file created: ${fileName}`);
}

const migrationName = process.argv[2];
if (!migrationName) {
    console.error('Please provide a migration name');
    process.exit(1);
}

createMigrationFile(migrationName);

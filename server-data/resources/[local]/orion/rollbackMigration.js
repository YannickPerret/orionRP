//rollback migration
const fs = require('fs');
const path = require('path');

function getLatestMigrationVersion(migrationsDir) {
    const files = fs.readdirSync(migrationsDir);
    const versions = files.map(file => parseInt(file.split('_')[0], 10));
    const maxVersion = versions.length > 0 ? Math.max(...versions) : -1;
    return maxVersion;
}

function rollbackMigration() {
    const migrationsDir = path.join(__dirname, 'core/server/migrations');
    const version = getLatestMigrationVersion(migrationsDir);
    const fileName = `${version.toString().padStart(4, '0')}_rollback.js`;
    const filePath = path.join(migrationsDir, fileName);

    const content = `module.exports = {
    version: ${version},
    migrate: async (db) => {
        // your code here
    }
};`;

    fs.writeFileSync(filePath, content);
    console.log(`Rollback file created: ${fileName}`);
}

rollbackMigration();


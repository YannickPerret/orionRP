class Migration {
  constructor(database) {
    this.db = database;
    this.migrations = [];
  }

  add(id, name, up) {
    this.migrations.push({ id, name, up });
  }

  async migrate() {
    await this.db.connect();
    for (const migration of this.migrations) {
      const isApplied = await this.isMigrationApplied(migration.id);
      if (!isApplied) {
        console.log(`Applying migration: ${migration.name}`);
        await migration.up(this.db);
        await this.recordMigration(migration.id, migration.name);
      }
    }
    console.log('All migrations are applied.');
  }

  async isMigrationApplied(migrationId) {
    const result = await this.db.get('migration', migrationId);
    return !!result;
  }

  async recordMigration(id, name) {
    try {
      await this.db.insert('migration', { id, name });
      console.log(`Recorded migration ${id}: ${name}`);
    } catch (error) {
      console.error('Error recording migration:', error);
      throw error;
    }
  }
}

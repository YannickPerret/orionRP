const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Migrations1730477341741 {
    name = 'Migrations1730477341741'

    async up(queryRunner) {
        await queryRunner.query(`DROP INDEX \`FK_368e146b785b574f42ae9e53d5e\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`FK_4a6e73662ea428080d335452a3e\` ON \`inventory_items\``);
        await queryRunner.query(`DROP INDEX \`FK_505a1d2410060c8358e1b37c131\` ON \`inventory_items\``);
        await queryRunner.query(`DROP INDEX \`FK_c0a0d32b2ae04801d6e5b9e5c80\` ON \`vehicles\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`steamId\` \`steamId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`ip\` \`ip\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`lastConnection\` \`lastConnection\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`activeCharacter\` \`activeCharacter\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`createdAt\` \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`roleId\` \`roleId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`inventory_items\` CHANGE \`inventoryId\` \`inventoryId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`inventory_items\` CHANGE \`itemId\` \`itemId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`items\` CHANGE \`effects\` \`effects\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`items\` CHANGE \`metadata\` \`metadata\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`vehicles\` CHANGE \`state\` \`state\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`vehicles\` CHANGE \`ownerId\` \`ownerId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`characters\` CHANGE \`model\` \`model\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`characters\` CHANGE \`appearance\` \`appearance\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`characters\` CHANGE \`clothes\` \`clothes\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`characters\` CHANGE \`weapons\` \`weapons\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`characters\` CHANGE \`position\` \`position\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`characters\` CHANGE \`createdAt\` \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`characters\` CHANGE \`inventoryId\` \`inventoryId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_368e146b785b574f42ae9e53d5e\` FOREIGN KEY (\`roleId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`inventory_items\` ADD CONSTRAINT \`FK_4a6e73662ea428080d335452a3e\` FOREIGN KEY (\`inventoryId\`) REFERENCES \`inventories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`inventory_items\` ADD CONSTRAINT \`FK_505a1d2410060c8358e1b37c131\` FOREIGN KEY (\`itemId\`) REFERENCES \`items\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`vehicles\` ADD CONSTRAINT \`FK_c0a0d32b2ae04801d6e5b9e5c80\` FOREIGN KEY (\`ownerId\`) REFERENCES \`characters\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`characters\` ADD CONSTRAINT \`FK_2bae75952608a6cd3f53aabf02e\` FOREIGN KEY (\`inventoryId\`) REFERENCES \`inventories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`characters\` DROP FOREIGN KEY \`FK_2bae75952608a6cd3f53aabf02e\``);
        await queryRunner.query(`ALTER TABLE \`vehicles\` DROP FOREIGN KEY \`FK_c0a0d32b2ae04801d6e5b9e5c80\``);
        await queryRunner.query(`ALTER TABLE \`inventory_items\` DROP FOREIGN KEY \`FK_505a1d2410060c8358e1b37c131\``);
        await queryRunner.query(`ALTER TABLE \`inventory_items\` DROP FOREIGN KEY \`FK_4a6e73662ea428080d335452a3e\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_368e146b785b574f42ae9e53d5e\``);
        await queryRunner.query(`ALTER TABLE \`characters\` CHANGE \`inventoryId\` \`inventoryId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`characters\` CHANGE \`createdAt\` \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`characters\` CHANGE \`position\` \`position\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`characters\` CHANGE \`weapons\` \`weapons\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`characters\` CHANGE \`clothes\` \`clothes\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`characters\` CHANGE \`appearance\` \`appearance\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`characters\` CHANGE \`model\` \`model\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`vehicles\` CHANGE \`ownerId\` \`ownerId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`vehicles\` CHANGE \`state\` \`state\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`items\` CHANGE \`metadata\` \`metadata\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`items\` CHANGE \`effects\` \`effects\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`inventory_items\` CHANGE \`itemId\` \`itemId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`inventory_items\` CHANGE \`inventoryId\` \`inventoryId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`roleId\` \`roleId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`createdAt\` \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`activeCharacter\` \`activeCharacter\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`lastConnection\` \`lastConnection\` timestamp NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`ip\` \`ip\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`steamId\` \`steamId\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`CREATE INDEX \`FK_c0a0d32b2ae04801d6e5b9e5c80\` ON \`vehicles\` (\`ownerId\`)`);
        await queryRunner.query(`CREATE INDEX \`FK_505a1d2410060c8358e1b37c131\` ON \`inventory_items\` (\`itemId\`)`);
        await queryRunner.query(`CREATE INDEX \`FK_4a6e73662ea428080d335452a3e\` ON \`inventory_items\` (\`inventoryId\`)`);
        await queryRunner.query(`CREATE INDEX \`FK_368e146b785b574f42ae9e53d5e\` ON \`users\` (\`roleId\`)`);
    }
}

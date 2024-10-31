const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Migrations1730322238129 {
    name = 'Migrations1730322238129'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`characters\` DROP COLUMN \`habits\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`source\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`activeCharacter\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`characters\` ADD \`model\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`characters\` ADD \`clothes\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`characters\` ADD \`weapons\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`characters\` ADD \`isDead\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_368e146b785b574f42ae9e53d5e\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`steamId\` \`steamId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`ip\` \`ip\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`lastConnection\` \`lastConnection\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`roleId\` \`roleId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`inventory_items\` DROP FOREIGN KEY \`FK_4a6e73662ea428080d335452a3e\``);
        await queryRunner.query(`ALTER TABLE \`inventory_items\` DROP FOREIGN KEY \`FK_505a1d2410060c8358e1b37c131\``);
        await queryRunner.query(`ALTER TABLE \`inventory_items\` CHANGE \`inventoryId\` \`inventoryId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`inventory_items\` CHANGE \`itemId\` \`itemId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`items\` CHANGE \`effects\` \`effects\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`items\` CHANGE \`metadata\` \`metadata\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`vehicles\` DROP FOREIGN KEY \`FK_c0a0d32b2ae04801d6e5b9e5c80\``);
        await queryRunner.query(`ALTER TABLE \`vehicles\` CHANGE \`state\` \`state\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`vehicles\` CHANGE \`ownerId\` \`ownerId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`characters\` DROP FOREIGN KEY \`FK_2bae75952608a6cd3f53aabf02e\``);
        await queryRunner.query(`ALTER TABLE \`characters\` CHANGE \`appearance\` \`appearance\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`characters\` CHANGE \`money\` \`money\` int NOT NULL DEFAULT '500'`);
        await queryRunner.query(`ALTER TABLE \`characters\` CHANGE \`position\` \`position\` text NULL`);
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
        await queryRunner.query(`ALTER TABLE \`characters\` CHANGE \`money\` \`money\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`characters\` CHANGE \`appearance\` \`appearance\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`characters\` ADD CONSTRAINT \`FK_2bae75952608a6cd3f53aabf02e\` FOREIGN KEY (\`inventoryId\`) REFERENCES \`inventories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`vehicles\` CHANGE \`ownerId\` \`ownerId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`vehicles\` CHANGE \`state\` \`state\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`vehicles\` ADD CONSTRAINT \`FK_c0a0d32b2ae04801d6e5b9e5c80\` FOREIGN KEY (\`ownerId\`) REFERENCES \`characters\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`items\` CHANGE \`metadata\` \`metadata\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`items\` CHANGE \`effects\` \`effects\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`inventory_items\` CHANGE \`itemId\` \`itemId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`inventory_items\` CHANGE \`inventoryId\` \`inventoryId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`inventory_items\` ADD CONSTRAINT \`FK_505a1d2410060c8358e1b37c131\` FOREIGN KEY (\`itemId\`) REFERENCES \`items\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`inventory_items\` ADD CONSTRAINT \`FK_4a6e73662ea428080d335452a3e\` FOREIGN KEY (\`inventoryId\`) REFERENCES \`inventories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`roleId\` \`roleId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`lastConnection\` \`lastConnection\` timestamp NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`ip\` \`ip\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`steamId\` \`steamId\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_368e146b785b574f42ae9e53d5e\` FOREIGN KEY (\`roleId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`characters\` DROP COLUMN \`isDead\``);
        await queryRunner.query(`ALTER TABLE \`characters\` DROP COLUMN \`weapons\``);
        await queryRunner.query(`ALTER TABLE \`characters\` DROP COLUMN \`clothes\``);
        await queryRunner.query(`ALTER TABLE \`characters\` DROP COLUMN \`model\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`activeCharacter\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`source\``);
        await queryRunner.query(`ALTER TABLE \`characters\` ADD \`habits\` text NULL DEFAULT 'NULL'`);
    }
}

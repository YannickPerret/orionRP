const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Migrations1730304059773 {
    name = 'Migrations1730304059773'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`identifier\` varchar(255) NOT NULL, \`steamId\` varchar(255) NULL, \`ip\` varchar(255) NULL, \`lastConnection\` timestamp NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`username\` varchar(255) NOT NULL, \`active\` tinyint NOT NULL DEFAULT 0, \`roleId\` int NULL, UNIQUE INDEX \`IDX_a3ffb1c0c8416b9fc6f907b743\` (\`id\`), UNIQUE INDEX \`IDX_2e7b7debda55e0e7280dc93663\` (\`identifier\`), UNIQUE INDEX \`IDX_0827cd828b990ba2a928ac5fd2\` (\`steamId\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`inventories\` (\`id\` int NOT NULL AUTO_INCREMENT, \`weight\` float NOT NULL DEFAULT '0', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`inventory_items\` (\`id\` int NOT NULL AUTO_INCREMENT, \`quantity\` int NOT NULL DEFAULT '1', \`inventoryId\` int NULL, \`itemId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`items\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`image\` varchar(255) NOT NULL, \`stackable\` tinyint NOT NULL DEFAULT 1, \`usable\` tinyint NOT NULL DEFAULT 0, \`effects\` text NULL, \`metadata\` text NULL, UNIQUE INDEX \`IDX_213736582899b3599acaade2cd\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`vehicles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`model\` varchar(255) NOT NULL, \`state\` text NULL, \`ownerId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`characters\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, \`name\` varchar(255) NOT NULL, \`appearance\` text NULL, \`habits\` text NULL, \`position\` text NULL, \`hunger\` float NOT NULL DEFAULT '100', \`thirst\` float NOT NULL DEFAULT '100', \`health\` float NOT NULL DEFAULT '100', \`armor\` float NOT NULL DEFAULT '0', \`money\` int NOT NULL DEFAULT '0', \`bank\` int NOT NULL DEFAULT '0', \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`inventoryId\` int NULL, UNIQUE INDEX \`REL_2bae75952608a6cd3f53aabf02\` (\`inventoryId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`roles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` enum ('admin', 'helper', 'developer', 'guest', 'user') NOT NULL, UNIQUE INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_368e146b785b574f42ae9e53d5e\` FOREIGN KEY (\`roleId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`inventory_items\` ADD CONSTRAINT \`FK_4a6e73662ea428080d335452a3e\` FOREIGN KEY (\`inventoryId\`) REFERENCES \`inventories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`inventory_items\` ADD CONSTRAINT \`FK_505a1d2410060c8358e1b37c131\` FOREIGN KEY (\`itemId\`) REFERENCES \`items\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`vehicles\` ADD CONSTRAINT \`FK_c0a0d32b2ae04801d6e5b9e5c80\` FOREIGN KEY (\`ownerId\`) REFERENCES \`characters\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`characters\` ADD CONSTRAINT \`FK_7c1bf02092d401b55ecc243ef1f\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`characters\` ADD CONSTRAINT \`FK_2bae75952608a6cd3f53aabf02e\` FOREIGN KEY (\`inventoryId\`) REFERENCES \`inventories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`characters\` DROP FOREIGN KEY \`FK_2bae75952608a6cd3f53aabf02e\``);
        await queryRunner.query(`ALTER TABLE \`characters\` DROP FOREIGN KEY \`FK_7c1bf02092d401b55ecc243ef1f\``);
        await queryRunner.query(`ALTER TABLE \`vehicles\` DROP FOREIGN KEY \`FK_c0a0d32b2ae04801d6e5b9e5c80\``);
        await queryRunner.query(`ALTER TABLE \`inventory_items\` DROP FOREIGN KEY \`FK_505a1d2410060c8358e1b37c131\``);
        await queryRunner.query(`ALTER TABLE \`inventory_items\` DROP FOREIGN KEY \`FK_4a6e73662ea428080d335452a3e\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_368e146b785b574f42ae9e53d5e\``);
        await queryRunner.query(`DROP INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` ON \`roles\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
        await queryRunner.query(`DROP INDEX \`REL_2bae75952608a6cd3f53aabf02\` ON \`characters\``);
        await queryRunner.query(`DROP TABLE \`characters\``);
        await queryRunner.query(`DROP TABLE \`vehicles\``);
        await queryRunner.query(`DROP INDEX \`IDX_213736582899b3599acaade2cd\` ON \`items\``);
        await queryRunner.query(`DROP TABLE \`items\``);
        await queryRunner.query(`DROP TABLE \`inventory_items\``);
        await queryRunner.query(`DROP TABLE \`inventories\``);
        await queryRunner.query(`DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_0827cd828b990ba2a928ac5fd2\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_2e7b7debda55e0e7280dc93663\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_a3ffb1c0c8416b9fc6f907b743\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }
}

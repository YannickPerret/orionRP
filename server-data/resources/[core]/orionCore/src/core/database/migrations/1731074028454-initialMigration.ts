import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1731074028454 implements MigrationInterface {
    name = 'InitialMigration1731074028454'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`inventories\` (\`id\` varchar(36) NOT NULL, \`weight\` float NOT NULL DEFAULT '0', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`items\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`image\` varchar(255) NOT NULL, \`stackable\` tinyint NOT NULL DEFAULT 1, \`usable\` tinyint NOT NULL DEFAULT 0, \`effects\` text NULL, \`metadata\` text NULL, UNIQUE INDEX \`IDX_213736582899b3599acaade2cd\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`inventory_item\` (\`id\` int NOT NULL AUTO_INCREMENT, \`quantity\` int NOT NULL, \`inventoryId\` varchar(36) NULL, \`itemId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`identifier\` varchar(255) NOT NULL, \`steamId\` varchar(255) NULL, \`ip\` varchar(255) NULL, \`lastConnection\` timestamp NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`username\` varchar(255) NOT NULL, \`active\` tinyint NOT NULL DEFAULT 0, \`source\` int NULL, \`activeCharacter\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`roleId\` varchar(36) NULL, UNIQUE INDEX \`IDX_2e7b7debda55e0e7280dc93663\` (\`identifier\`), UNIQUE INDEX \`IDX_0827cd828b990ba2a928ac5fd2\` (\`steamId\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`characters\` (\`id\` varchar(36) NOT NULL, \`userId\` varchar(255) NOT NULL, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`gender\` enum ('male', 'female') NOT NULL DEFAULT 'male', \`model\` varchar(255) NULL, \`appearance\` text NULL, \`clothes\` text NULL, \`weapons\` text NULL, \`money\` int NOT NULL DEFAULT '500', \`bank\` int NOT NULL DEFAULT '0', \`position\` text NOT NULL, \`hunger\` float NOT NULL DEFAULT '100', \`thirst\` float NOT NULL DEFAULT '100', \`health\` float NOT NULL DEFAULT '100', \`armor\` float NOT NULL DEFAULT '0', \`isDead\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`inventoryId\` varchar(36) NULL, UNIQUE INDEX \`REL_2bae75952608a6cd3f53aabf02\` (\`inventoryId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`vehicles\` (\`id\` varchar(36) NOT NULL, \`model\` varchar(255) NOT NULL, \`plate\` varchar(255) NOT NULL, \`positionX\` float NOT NULL, \`positionY\` float NOT NULL, \`positionZ\` float NOT NULL, \`isImpounded\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`characterId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`roles\` (\`id\` varchar(36) NOT NULL, \`name\` enum ('admin', 'helper', 'developer', 'guest', 'user') NOT NULL, UNIQUE INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`inventory_item\` ADD CONSTRAINT \`FK_ce6b6a0a8ba96d183b0d2104621\` FOREIGN KEY (\`inventoryId\`) REFERENCES \`inventories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`inventory_item\` ADD CONSTRAINT \`FK_21f08891af6b1afb9be05f27e3a\` FOREIGN KEY (\`itemId\`) REFERENCES \`items\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_368e146b785b574f42ae9e53d5e\` FOREIGN KEY (\`roleId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`characters\` ADD CONSTRAINT \`FK_7c1bf02092d401b55ecc243ef1f\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`characters\` ADD CONSTRAINT \`FK_2bae75952608a6cd3f53aabf02e\` FOREIGN KEY (\`inventoryId\`) REFERENCES \`inventories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`vehicles\` ADD CONSTRAINT \`FK_323f8663aae12ec0f48d95a3326\` FOREIGN KEY (\`characterId\`) REFERENCES \`characters\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`vehicles\` DROP FOREIGN KEY \`FK_323f8663aae12ec0f48d95a3326\``);
        await queryRunner.query(`ALTER TABLE \`characters\` DROP FOREIGN KEY \`FK_2bae75952608a6cd3f53aabf02e\``);
        await queryRunner.query(`ALTER TABLE \`characters\` DROP FOREIGN KEY \`FK_7c1bf02092d401b55ecc243ef1f\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_368e146b785b574f42ae9e53d5e\``);
        await queryRunner.query(`ALTER TABLE \`inventory_item\` DROP FOREIGN KEY \`FK_21f08891af6b1afb9be05f27e3a\``);
        await queryRunner.query(`ALTER TABLE \`inventory_item\` DROP FOREIGN KEY \`FK_ce6b6a0a8ba96d183b0d2104621\``);
        await queryRunner.query(`DROP INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` ON \`roles\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
        await queryRunner.query(`DROP TABLE \`vehicles\``);
        await queryRunner.query(`DROP INDEX \`REL_2bae75952608a6cd3f53aabf02\` ON \`characters\``);
        await queryRunner.query(`DROP TABLE \`characters\``);
        await queryRunner.query(`DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_0827cd828b990ba2a928ac5fd2\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_2e7b7debda55e0e7280dc93663\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`inventory_item\``);
        await queryRunner.query(`DROP INDEX \`IDX_213736582899b3599acaade2cd\` ON \`items\``);
        await queryRunner.query(`DROP TABLE \`items\``);
        await queryRunner.query(`DROP TABLE \`inventories\``);
    }

}

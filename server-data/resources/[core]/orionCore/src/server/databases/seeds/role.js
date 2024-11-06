// resources/orionCore/server/databases/seeds/role.js
const AppDataSource = require('../database.ts');
const { RoleType } = require('../../models/schemas/Role.js');
const Role = require('../../models/schemas/Role.js');

async function seed() {
    try {
        // Initialisez la connexion
        await AppDataSource.initialize();

        // Créer un dépôt pour le modèle de rôle
        const roleRepository = AppDataSource.getRepository(Role);

        // Itérer sur chaque type de rôle et vérifier s'il existe déjà
        for (const roleName of Object.values(RoleType)) {
            const existingRole = await roleRepository.findOne({ where: { name: roleName } });
            if (!existingRole) {
                // Créer et sauvegarder le rôle s'il n'existe pas
                const role = roleRepository.create({ name: roleName });
                await roleRepository.save(role);
                console.log(`Role "${roleName}" créé`);
            } else {
                console.log(`Role "${roleName}" déjà existant`);
            }
        }

        // Fermer la connexion après le seeding
        await AppDataSource.destroy();
    } catch (error) {
        console.error('Erreur lors du seeding des rôles:', error);
        await AppDataSource.destroy();
    }
}

seed();

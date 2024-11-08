import AppDataSource from '../database';
import { RoleType, Role } from '../../../models/Role';

async function seed() {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
            console.log("Data Source has been initialized for seeding.");
        }

        const existingRoles = await Role.find();
        const existingRoleNames = existingRoles.map(role => role.name);

        for (const roleName of Object.values(RoleType)) {
            if (!existingRoleNames.includes(roleName)) {
                const role = new Role();
                role.name = roleName;
                await role.save();
                console.log(`Role "${roleName}" créé`);
            } else {
                console.log(`Role "${roleName}" déjà existant`);
            }
        }
    } catch (error) {
        console.error('Erreur lors du seeding des rôles:', error);
    } finally {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
            console.log("Data Source has been destroyed after seeding.");
        }
    }
}

seed();

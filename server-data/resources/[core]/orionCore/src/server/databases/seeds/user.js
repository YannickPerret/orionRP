const AppDataSource = require('../database.ts');
const bcrypt = require('bcrypt');
const User = require('../../models/schemas/User.js');
const Role = require('../../models/schemas/Role.js');

async function seed() {
    try {
        // Initialisez la connexion
        await AppDataSource.initialize();

        // Créez le rôle administrateur si non existant
        const roleRepository = AppDataSource.getRepository(Role);
        let adminRole = await roleRepository.findOne({ where: { name: 'admin' } });

        if (!adminRole) {
            adminRole = roleRepository.create({ name: 'admin' });
            await roleRepository.save(adminRole);
            console.log('Role admin created');
        }

        // Créez un compte administrateur si non existant
        const userRepository = AppDataSource.getRepository(User);
        const adminExists = await userRepository.findOne({ where: { username: 'admin' } });

        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('28469', 10);
            const adminUser = userRepository.create({
                identifier: 'license:4c669f4aa1ab1c27139642bb0a44857aa8949549',
                username: 'admin',
                email: 'games@yannickperret.com',
                password: hashedPassword,
                active: true,
                steamId: 'steam:110000108f4ff2d',
                role: adminRole,
            });

            await userRepository.save(adminUser);
            console.log('Admin user created');
        } else {
            console.log('Admin user already exists');
        }

        // Fermer la connexion après le seeding
        await AppDataSource.destroy();
    } catch (error) {
        console.error('Error during seeding:', error);
        await AppDataSource.destroy();
    }
}

seed();

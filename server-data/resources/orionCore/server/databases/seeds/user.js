const { AppDataSource } = require('./database');
const bcrypt = require('bcrypt');
const User = require('../models/User');

async function seed() {
    try {
        // Initialisez la connexion
        await AppDataSource.initialize();

        // Créez un compte administrateur si non existant
        const userRepository = AppDataSource.getRepository(User);
        const adminExists = await userRepository.findOne({ where: { username: 'admin' } });

        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('28469', 10);
            const adminUser = userRepository.create({
                identifier: 'admin_id',
                username: 'admin',
                email: 'games@yannickperret.com',
                password: hashedPassword,
                active: true,
                license: 'admin_license',
                steamId: 'admin_steam_id',
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

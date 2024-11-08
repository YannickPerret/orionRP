import AppDataSource from '../database';
import bcrypt from 'bcrypt';
import { UserEntity } from '../../../modules/users/user.entity';
import {Role, RoleType} from '../../../models/Role';

async function seed() {
    try {
        await AppDataSource.initialize();

        let adminRole = await Role.findOne({ where: { name: 'admin' } });

        if (!adminRole) {
            adminRole = new Role();
            adminRole.name = RoleType.ADMIN;
            await adminRole.save();
            console.log('Role admin created');
        }

        const adminExists = await UserEntity.findOne({ where: { username: 'admin' } });

        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('28469', 10);
            const adminUser = new UserEntity();
            adminUser.identifier = 'license:4c669f4aa1ab1c27139642bb0a44857aa8949549';
            adminUser.username = 'admin';
            adminUser.email = 'games@yannickperret.com';
            adminUser.password = hashedPassword;
            adminUser.active = true;
            adminUser.steamId = 'steam:110000108f4ff2d';
            adminUser.role = adminRole;

            await adminUser.save();
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

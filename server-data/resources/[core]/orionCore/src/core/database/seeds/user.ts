import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function seedUser() {
    try {
        console.log('Initialisation du seeding des utilisateurs...');

        let adminRole = await prisma.role.findUnique({
            where: { name: 'ADMIN' },
        });

        if (!adminRole) {
            adminRole = await prisma.role.create({
                data: {
                    name: 'ADMIN',
                },
            });
            console.log('Rôle ADMIN créé');
        }

        // Vérifier si l'utilisateur admin existe déjà
        const adminExists = await prisma.user.findUnique({
            where: { username: 'admin' },
        });

        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('28469', 10);

            await prisma.user.create({
                data: {
                    license: 'license:4c669f4aa1ab1c27139642bb0a44857aa8949549',
                    username: 'admin',
                    email: 'games@yannickperret.com',
                    password: hashedPassword,
                    active: true,
                    steamId: 'steam:110000108f4ff2d',
                    role: {
                        connect: {
                            id: adminRole.id,
                        },
                    },
                },
            });
            console.log('Utilisateur admin créé');
        } else {
            console.log('Utilisateur admin déjà existant');
        }

        console.log('Seeding terminé.');
    } catch (error) {
        console.error('Erreur lors du seeding des utilisateurs:', error);
    } finally {
        await prisma.$disconnect();
        console.log('Connexion à la base de données fermée après le seeding.');
    }
}
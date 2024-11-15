import { PrismaClient, RoleType } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedRoles() {
    try {
        console.log("Initialisation du seeding des rôles...");

        const existingRoles = await prisma.role.findMany();
        const existingRoleNames = existingRoles.map((role: { name: any; }) => role.name);

        for (const roleName of Object.values(RoleType)) {
            if (!existingRoleNames.includes(roleName)) {
                await prisma.role.create({
                    data: {
                        name: roleName,
                    },
                });
                console.log(`Rôle "${roleName}" créé`);
            } else {
                console.log(`Rôle "${roleName}" déjà existant`);
            }
        }

        console.log("Seeding des rôles terminé.");
    } catch (error) {
        console.error('Erreur lors du seeding des rôles:', error);
    } finally {
        await prisma.$disconnect();
        console.log("Connexion à la base de données fermée après le seeding.");
    }
}
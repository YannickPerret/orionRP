import { PrismaClient } from '@prisma/client';
import {seedRoles} from "./role";
import {seedUser} from "./user";

const prisma = new PrismaClient();

async function main() {

}

main()
    .then(async () => {
        await seedRoles()
        await seedUser()
        await prisma.$disconnect();
    })
    .catch(async e => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
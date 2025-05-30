import { PrismaClient } from '@prisma/client';
import { Injectable } from '../decorators';

@Injectable()
export class PrismaService extends PrismaClient {
    private static instance: PrismaService;

    private constructor() {
        super({
            log: [
                { emit: 'stdout', level: 'query' },
                { emit: 'stdout', level: 'info' },
                { emit: 'stdout', level: 'warn' },
                { emit: 'stdout', level: 'error' }
            ]
        });
        this.connectToDatabase();
    }

    static getInstance(): PrismaService {
        if (!PrismaService.instance) {
            PrismaService.instance = new PrismaService();
        }
        return PrismaService.instance;
    }

    private async connectToDatabase(): Promise<void> {
        try {
            await this.$connect();
            console.info('Connexion à la base de données établie automatiquement.');
        } catch (error) {
            console.error('Erreur lors de la connexion automatique à la base de données:', error);
            throw error;
        }
    }

    async disconnect(): Promise<void> {
        try {
            await this.$disconnect();
            console.info('Connexion à la base de données fermée.');
        } catch (error) {
            console.error('Erreur lors de la déconnexion de la base de données:', error);
            throw error;
        }
    }
}

// src/core/database/PrismaService.ts
import { PrismaClient } from '@prisma/client';
import { Injectable, Inject } from '../decorators';
import { LoggerService } from '../modules/logger/logger.service';
import { ErrorHandler } from '../modules/error/error.handler';

@Injectable()
export class PrismaService extends PrismaClient {
    private static instance: PrismaService;

    @Inject(LoggerService)
    private logger: LoggerService;

    @Inject(ErrorHandler)
    private errorHandler: ErrorHandler;

    private connectionRetries = 0;
    private maxRetries = 5;
    private retryDelay = 1000; // 1 seconde

    private constructor() {
        super({
            log: [
                { emit: 'event', level: 'query' },
                { emit: 'stdout', level: 'info' },
                { emit: 'stdout', level: 'warn' },
                { emit: 'stdout', level: 'error' }
            ],
            errorFormat: 'pretty'
        });

        this.setupEventListeners();
        this.connectToDatabase();
    }

    static getInstance(): PrismaService {
        if (!PrismaService.instance) {
            PrismaService.instance = new PrismaService();
        }
        return PrismaService.instance;
    }

    private setupEventListeners(): void {
        // Log des requêtes lentes
        this.$on('query', (e) => {
            if (e.duration > 1000) { // Plus de 1 seconde
                this.logger?.warn('Slow query detected:', {
                    query: e.query,
                    duration: `${e.duration}ms`,
                    params: e.params
                });
            }
        });

        // Log des erreurs
        this.$on('error', (e) => {
            this.errorHandler?.handle(new Error(e.message), {
                action: 'prisma_error',
                target: e.target
            });
        });
    }

    private async connectToDatabase(): Promise<void> {
        while (this.connectionRetries < this.maxRetries) {
            try {
                await this.$connect();
                console.info('✅ Database connection established successfully.');
                this.connectionRetries = 0; // Reset sur succès
                return;
            } catch (error) {
                this.connectionRetries++;
                console.error(`❌ Database connection failed (attempt ${this.connectionRetries}/${this.maxRetries}):`, error.message);

                if (this.connectionRetries >= this.maxRetries) {
                    console.error('💀 Max connection retries reached. Exiting...');
                    process.exit(1);
                }

                // Attendre avant la prochaine tentative
                await new Promise(resolve => setTimeout(resolve, this.retryDelay * this.connectionRetries));
            }
        }
    }

    /**
     * Exécute une opération avec retry automatique
     */
    async executeWithRetry<T>(
        operation: () => Promise<T>,
        maxRetries: number = 3,
        context?: string
    ): Promise<T> {
        let lastError: Error;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await operation();
            } catch (error) {
                lastError = error;

                if (this.isRetryableError(error)) {
                    if (attempt < maxRetries) {
                        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000); // Exponential backoff
                        this.logger?.warn(`Database operation failed (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms...`, {
                            context,
                            error: error.message
                        });

                        await new Promise(resolve => setTimeout(resolve, delay));
                        continue;
                    }
                }

                // Erreur non-retryable ou max tentatives atteint
                this.errorHandler?.handle(error, {
                    action: 'executeWithRetry',
                    context,
                    attempts: attempt,
                    maxRetries
                });

                throw error;
            }
        }

        throw lastError;
    }

    /**
     * Détermine si une erreur peut être retryée
     */
    private isRetryableError(error: any): boolean {
        const retryableErrors = [
            'P1001', // Can't reach database server
            'P1008', // Operations timed out
            'P1017', // Server has closed the connection
            'P2024', // Timed out fetching a new connection
            'P2034'  // Transaction failed due to a write conflict
        ];

        if (error.code && retryableErrors.includes(error.code)) {
            return true;
        }

        // Vérifier les messages d'erreur courants
        const errorMessage = error.message?.toLowerCase() || '';
        return errorMessage.includes('timeout') ||
            errorMessage.includes('connection') ||
            errorMessage.includes('network') ||
            errorMessage.includes('ECONNRESET') ||
            errorMessage.includes('ETIMEDOUT');
    }

    /**
     * Transaction avec retry
     */
    async transactionWithRetry<T>(
        fn: (prisma: PrismaClient) => Promise<T>,
        maxRetries: number = 3
    ): Promise<T> {
        return this.executeWithRetry(
            () => this.$transaction(fn),
            maxRetries,
            'transaction'
        );
    }

    /**
     * Vérification de la santé de la connexion
     */
    async healthCheck(): Promise<boolean> {
        try {
            await this.$queryRaw`SELECT 1`;
            return true;
        } catch (error) {
            this.logger?.error('Database health check failed:', error);
            return false;
        }
    }

    /**
     * Statistiques de la base de données
     */
    async getStats(): Promise<any> {
        try {
            // Exemple pour MySQL/MariaDB
            const result = await this.$queryRaw`
                SELECT 
                    COUNT(*) as total_connections,
                    (SELECT COUNT(*) FROM information_schema.processlist WHERE command != 'Sleep') as active_connections
            `;

            return result[0];
        } catch (error) {
            this.logger?.warn('Could not fetch database stats:', error);
            return null;
        }
    }

    async disconnect(): Promise<void> {
        try {
            await this.$disconnect();
            console.info('🔌 Database connection closed.');
        } catch (error) {
            console.error('❌ Error during database disconnection:', error);
            throw error;
        }
    }

    /**
     * Nettoyage gracieux à l'arrêt du serveur
     */
    async gracefulShutdown(): Promise<void> {
        console.log('🛑 Shutting down database connection...');

        try {
            // Attendre que les requêtes en cours se terminent (timeout 30s)
            await Promise.race([
                this.disconnect(),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Disconnect timeout')), 30000)
                )
            ]);
        } catch (error) {
            console.error('⚠️ Error during graceful shutdown:', error);
            // Force disconnect
            process.exit(1);
        }
    }
}

// Gestionnaire de signaux pour arrêt gracieux
process.on('SIGINT', async () => {
    const prisma = PrismaService.getInstance();
    await prisma.gracefulShutdown();
});

process.on('SIGTERM', async () => {
    const prisma = PrismaService.getInstance();
    await prisma.gracefulShutdown();
});
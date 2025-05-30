// src/core/modules/config/config.service.ts
import { Injectable } from '../../decorators';

@Injectable()
export class ConfigService {
    private config: Map<string, any> = new Map();

    constructor() {
        this.loadConfig();
    }

    private loadConfig(): void {
        // Configuration par défaut
        this.setDefaults();

        // Charger depuis l'environnement si nécessaire
        this.loadFromEnv();
    }

    private setDefaults(): void {
        this.config.set('server.maxPlayers', 64);
        this.config.set('server.name', 'Orion Server');
        this.config.set('character.defaultMoney', 500);
        this.config.set('character.defaultBank', 0);
        this.config.set('cache.defaultTTL', 300000); // 5 minutes
        this.config.set('logging.level', 'info');
    }

    private loadFromEnv(): void {
        // Exemple de chargement depuis variables d'environnement
        if (process.env.MAX_PLAYERS) {
            this.config.set('server.maxPlayers', parseInt(process.env.MAX_PLAYERS));
        }
    }

    get<T = any>(key: string, defaultValue?: T): T {
        return this.config.get(key) ?? defaultValue;
    }

    set(key: string, value: any): void {
        this.config.set(key, value);
    }

    has(key: string): boolean {
        return this.config.has(key);
    }

    // Helpers typés pour les configurations communes
    getServerConfig() {
        return {
            maxPlayers: this.get<number>('server.maxPlayers'),
            name: this.get<string>('server.name'),
        };
    }

    getCharacterConfig() {
        return {
            defaultMoney: this.get<number>('character.defaultMoney'),
            defaultBank: this.get<number>('character.defaultBank'),
            spawnPosition: this.get('character.spawnPosition', { x: 0, y: 0, z: 0 }),
        };
    }

    getCacheConfig() {
        return {
            defaultTTL: this.get<number>('cache.defaultTTL'),
        };
    }
}

// Décorateur pour injecter la configuration
export function Config(key: string, defaultValue?: any) {
    return function (target: any, propertyKey: string) {
        Object.defineProperty(target, propertyKey, {
            get: () => {
                const config = new ConfigService();
                return config.get(key, defaultValue);
            },
            enumerable: true,
            configurable: true,
        });
    };
}
import 'reflect-metadata';
import {register, resolve} from "./container";
import {RoleType} from "../server/modules/roles/role.enum";
import "@citizenfx/server";
import "@citizenfx/client";

export enum TickInterval {
    EVERY_FRAME = 0,
    EVERY_SECOND = 1000,
    EVERY_MINUTE = 60000,
    EVERY_5_MINUTE = 300000,
    EVERY_10_MINUTE = 600000,
    EVERY_15_MINUTE = 900000,
    EVERY_30_MINUTE = 1800000,
    EVERY_HOUR = 3600000,
}

type CommandOptions = {
    name: string;
    description: string;
    role: RoleType | null;
    passthroughNuiFocus?: boolean;
    passthroughPauseMenu?: boolean;
    toggle?: boolean;
};

interface EventOptions {
    validate?: (...args: any[]) => boolean;
    rateLimit?: number;
}


export function Injectable(): ClassDecorator {
    return (target: any) => {
        const instance = new target();
        register(target, instance);
        if (typeof instance.initialize === 'function') {
            instance.initialize();
        }
    };
}

export function Inject(token: any): PropertyDecorator {
    return (target, propertyKey) => {
        Object.defineProperty(target, propertyKey, {
            get: () => {
                try {
                    return resolve(token);
                } catch (error) {
                    console.error(`Erreur lors de la résolution de ${token.name}: ${error.message}`);
                    throw error;
                }
            },
            enumerable: true,
            configurable: true,
        });
    };
}

export function ServerEvent(eventName: string, options?: EventOptions) {
    const prefixedEventName = `orionCore:server:${eventName}`;
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value;

        descriptor.value = function (...args: any[]) {
            // Validation optionnelle
            if (options?.validate && !options.validate(...args)) {
                console.warn(`Event validation failed for ${eventName}`);
                return;
            }

            return original.apply(this, [source, ...args]);
        };

        onNet(prefixedEventName, (...args: any[]) => {
            try {
                descriptor.value.apply(target, args);
            } catch (error) {
                console.error(`Error in event ${eventName}:`, error);
            }
        });

        return descriptor;
    };
}


export function ClientEvent(eventName: string, scope: string = 'public') {
    const prefixedEventName = `orionCore:client:${eventName}`;
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value;
        if (scope === 'public') {
            onNet(prefixedEventName, async (...args: any[]) => {
                await original.apply(target, args);
            });
        }
        else {
            on(prefixedEventName, async (...args: any[]) => {
                await original.apply(target, args);
            });
        }
        return descriptor;
    };
}

export function GameEvent(eventName: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value;
        on(eventName, async (...args: any[]) => {
            await original.apply(target, args);
        });
        return descriptor;
    };
}

export function KeyMapping(commandName: string, description: string, device: string, defaultKey: string) {
    if (!commandName || !description || !device || !defaultKey) {
        throw new Error(`Invalid arguments for KeyMapping: commandName=${commandName}, description=${description}, device=${device}, defaultKey=${defaultKey}`);
    }

    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        // Enregistre la commande avec le KeyMapping
        RegisterCommand(commandName, async (source: number, args: string[], rawCommand: string) => {
            const originalMethod = descriptor.value;
            console.log(`Commande ${commandName} appelée par le joueur ${source}`);
            await originalMethod.apply(resolve(target.constructor), [source, args, rawCommand]);
        }, false);

        // Enregistre la touche par défaut
        try {
            RegisterKeyMapping(commandName, description, device, defaultKey);
            console.log(`KeyMapping enregistré : ${commandName} - ${description} [${device}:${defaultKey}]`);
        } catch (error) {
            console.error(`Erreur lors de l'enregistrement du KeyMapping : ${error.message}`);
        }

        return descriptor;
    };
}


export function Command(options: CommandOptions) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value;
        RegisterCommand(
            options.name,
            async (source: number, args: string[], rawCommand: string) => {
                console.log(`Commande ${options.name} appelée par le joueur ${source}`);
                if (options.role) {
                    console.log(`Rôles requis : ${JSON.stringify(options.role)}`);
                }

                await original.apply(resolve(target.constructor), [source, args, rawCommand]);
            },
            false
        );
        console.log(`Commande ${options.name} enregistrée avec la description : "${options.description}"`);
        return descriptor;
    };
}


export function OnNuiEvent(eventName: string): MethodDecorator {
    return (target, propertyKey, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;

        // Enregistrement de l'événement NUI
        RegisterNuiCallbackType(eventName);
        on(`__cfx_nui:${eventName}`, async (data: any, cb: (result: any) => void) => {
            try {
                // Appel de la méthode originale et envoi du résultat via cb
                const result = await originalMethod.apply(target, [data]);
                cb({ status: 'ok', data: result });
            } catch (error) {
                console.error(`Erreur lors du traitement de l'événement NUI "${eventName}":`, error);
                cb({ status: 'error', message: error.message });
            }
        });

        return descriptor;
    };
}

export function Tick(interval: number = TickInterval.EVERY_SECOND): MethodDecorator {
    return function (target, propertyKey, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        setInterval(() => {
            try {
                originalMethod.apply(target);
            } catch (error) {
                console.error(`Erreur lors de l'exécution du tick ${propertyKey.toString()}:`, error);
            }
        }, interval);

        return descriptor;
    };
}

// src/core/modules/error/error.handler.ts
import { Injectable } from '../../decorators';
import { LoggerService } from '../logger/logger.service';

export interface ErrorContext {
    userId?: string;
    source?: number;
    action?: string;
    data?: any;
}

@Injectable()
export class ErrorHandler {
    constructor(private logger: LoggerService) {}

    handle(error: Error, context?: ErrorContext): void {
        const errorData = {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            ...context
        };

        // Log selon la gravité
        if (this.isCriticalError(error)) {
            this.logger.error('CRITICAL ERROR', errorData);
            // Potentiellement notifier les admins
        } else {
            this.logger.warn('Handled Error', errorData);
        }
    }

    private isCriticalError(error: Error): boolean {
        return error.message.includes('Database') ||
            error.message.includes('Connection') ||
            error.stack?.includes('PrismaService');
    }
}

// Décorateur pour wrapper automatiquement les méthodes
export function HandleErrors() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            try {
                return await originalMethod.apply(this, args);
            } catch (error) {
                const errorHandler = new ErrorHandler(this.logger || console);
                errorHandler.handle(error, {
                    action: `${target.constructor.name}.${propertyKey}`,
                    data: args
                });
                throw error;
            }
        };

        return descriptor;
    };
}
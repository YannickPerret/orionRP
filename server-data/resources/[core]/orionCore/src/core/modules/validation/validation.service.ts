// src/core/modules/validation/validation.service.ts
import { Injectable } from '../../decorators';

export interface ValidationRule<T = any> {
    validate: (value: T) => boolean;
    message: string;
}

export interface ValidationSchema {
    [key: string]: ValidationRule[];
}

@Injectable()
export class ValidationService {

    validate<T extends Record<string, any>>(data: T, schema: ValidationSchema): ValidationResult {
        const errors: string[] = [];

        for (const [field, rules] of Object.entries(schema)) {
            const value = data[field];

            for (const rule of rules) {
                if (!rule.validate(value)) {
                    errors.push(`${field}: ${rule.message}`);
                }
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Règles de validation communes
    static readonly Rules = {
        required: (message = 'Field is required'): ValidationRule => ({
            validate: (value) => value !== null && value !== undefined && value !== '',
            message
        }),

        minLength: (min: number, message?: string): ValidationRule<string> => ({
            validate: (value) => typeof value === 'string' && value.length >= min,
            message: message || `Minimum length is ${min}`
        }),

        maxLength: (max: number, message?: string): ValidationRule<string> => ({
            validate: (value) => typeof value === 'string' && value.length <= max,
            message: message || `Maximum length is ${max}`
        }),

        isNumber: (message = 'Must be a number'): ValidationRule => ({
            validate: (value) => typeof value === 'number' && !isNaN(value),
            message
        }),

        isPositive: (message = 'Must be positive'): ValidationRule<number> => ({
            validate: (value) => typeof value === 'number' && value > 0,
            message
        }),

        isEmail: (message = 'Invalid email format'): ValidationRule<string> => ({
            validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            message
        })
    };
}

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

// Décorateur pour validation automatique
export function Validate(schema: ValidationSchema) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            const validation = new ValidationService();
            const data = args[0]; // Premier argument comme données à valider

            const result = validation.validate(data, schema);
            if (!result.isValid) {
                throw new Error(`Validation failed: ${result.errors.join(', ')}`);
            }

            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
}
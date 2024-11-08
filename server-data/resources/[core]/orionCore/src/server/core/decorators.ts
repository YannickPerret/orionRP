export function ServerEvent(eventName: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value;
        descriptor.value = function (...args: any[]) {
            const playerId = source;
            return original.apply(this, [playerId, ...args]);
        };
        onNet(eventName, (...args: any[]) => {
            descriptor.value.apply(target, args);
        });
        return descriptor;
    };
}

export function Interval(milliseconds: number) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value;
        setInterval(() => {
            original.apply(target);
        }, milliseconds);
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
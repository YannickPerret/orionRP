const container = new Map();

export function register(token: any, instance: any) {
    if (!container.has(token)) {
        container.set(token, instance);
    }
}

export function resolve<T>(token: new (...args: any[]) => T): T {
    if (!container.has(token)) {
        container.set(token, new token());
    }
    const instance = container.get(token);
    if (!instance) {
        throw new Error(`Instance non trouvée pour le token ${token.name}`);
    }
    return instance;
}

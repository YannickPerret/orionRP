const container = new Map();

export function register(token: any, instance: any) {
    container.set(token, instance);
}

export function resolve<T>(token: new (...args: any[]) => T): T {
    const instance = container.get(token);
    if (!instance) {
        throw new Error(`Instance non trouvée pour le token ${token}`);
    }
    return instance;
}

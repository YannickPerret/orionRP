export const Delay = (ms: number): Promise<boolean> => {
    return new Promise(resolve => setTimeout(() => resolve(true), ms));
};

export const uuidv4 = (): string => {
    let uuid = '';
    for (let ii = 0; ii < 32; ii += 1) {
        switch (ii) {
            case 8:
            case 20:
                uuid += '-';
                uuid += ((Math.random() * 16) | 0).toString(16);
                break;
            case 12:
                uuid += '-';
                uuid += '4';
                break;
            case 16:
                uuid += '-';
                uuid += ((Math.random() * 4) | 8).toString(16);
                break;
            default:
                uuid += ((Math.random() * 16) | 0).toString(16);
        }
    }
    return uuid;
};

export async function getGroundLevel(x: number, y: number, z: number): Promise<unknown> {
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            const [foundGround, groundZ] = GetGroundZFor_3dCoord(x, y, z, false);
            if (foundGround) {
                clearInterval(interval);
                resolve(groundZ);
            } else {
                z -= 10;
                if (z < 0) {
                    clearInterval(interval);
                    resolve(0);
                }
            }
        }, 50);
    });
}

export const config = {
    events: {
        christmas: true,
        halloween: true,
    },
    character: {
        spawnPosition: {
            x: 205.316,
            y: 1167.378,
            z: 227.005,
        },
        creator: {
            position: {
                x: -817.160462,
                y: -931.239562,
                z: 15.642456,
            },
            headingPosition: 235.275588,
        },
        monney: 500,
        bank: 0,
        healthRegen: 0.0,
        needs: {
            timeRemaining: 20000,
            hunger: {
                max: 100,
                decayRate: 0.5,
            },
            thirst: {
                max: 100,
                decayRate: 0.5,
            },
        },
        coma: {
            healthThreshold: 0,
        },
    },
    vehicle :{
        forceFirstPerson: true,
    }
};

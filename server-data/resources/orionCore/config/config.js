global.config = {
    events: {
        christmas: true,
        halloween: true,
    },
    character: {
        monney: 500,
        bank: 0,
        healthRegen: 0.0,
        needs: {
            timeRemaining: 20000,
            hunger: {
                max: 100,
                decayRate: 0.5, // Diminution de la faim par minute
            },
            thirst: {
                max: 100,
                decayRate: 0.5, // Diminution de la soif par minute
            },
        },
        coma: {
            healthThreshold: 0, // Seuil de santé pour tomber dans le coma
        },
    }
};

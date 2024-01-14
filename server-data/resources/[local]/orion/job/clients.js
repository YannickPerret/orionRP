//job system
(async => {
    let isOnService = false;
    let currentSkin = {};
    let lastSkin = {};
    let defaultJob = 'unemployed';

    // Net events
    onNet('orion:job:c:intialize', () => {
        emitNet('orion:job:s:intialize', source, defaultJob);
    });

    onNet('orion:job:c:takeService', () => {
        isOnService = !isOnService;
        if (isOnService) {
            //start service
        }
        else {
            //stop service
        }
    });

    onNet('orion:job:c:takeUniform', (skin) => {
        currentSkin = skin;
    })

    onNet('orion:job:c:saveSkin', (skin) => {
        lastSkin = skin;
    })

    //functions



    // Register NUI Callbacks


    // threads


})();
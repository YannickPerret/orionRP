//job system
(async => {
    let isOnService = false;
    let currentSkin = {};
    let lastSkin = {};
    let job = {};

    // Net events
    onNet('orion:job:c:getJob', (job) => {
        job = job;
    });

    exports('getJob', () => {
        return job;
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
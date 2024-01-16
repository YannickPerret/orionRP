(async => {
    const { Jobs } = require('./job/job');
    const JobsManager = require('./core/server/jobManager');
    const PlayerManager = require('./core/server/playerManager');
    const MarkerManager = require('./core/server/markerManager');



    onNet('orion:job:s:takeService', (jobId) => {
        const source = global.source;
        const job = JobsManager.getJobById(jobId);
    })

    onNet('orion:job:s:paycheck', (jobId) => {
        const source = global.source;
        const job = JobsManager.getJobById(jobId);
    });

    (async () => {
        let markersList = [];
        await Jobs.getAll().then(async jobDb => {
            jobDb.forEach(job => {
                JobsManager.addJob(job);
                if (job.markers) {
                    job.markers.forEach(marker => {
                        markersList.push({
                            id: marker.id,
                            name: marker.name,
                            text: marker.text,
                            coords: marker.coords,
                            cb: () => {

                            },
                            options: {
                                color: { r: 0, g: 128, b: 0 },
                                scale: [1.0, 1.0, 1.0],
                                type: 27,
                                noText: false
                            },
                            require: [
                                {
                                    jobId: job.id,
                                }
                            ]
                        });
                    });
                }
            });
        });
        MarkerManager.addMarkers(markersList);
    })()


})()
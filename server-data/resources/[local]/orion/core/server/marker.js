(async () => {
    const MarkerManager = require('./core/server/markerManager.js');
    const JobsManager = require('./core/server/jobManager.js');

    onNet('orion:markers:s:initializeMarkers', async () => {
        const source = global.source;
        const jobs = JobsManager.getJobs();
        // add in marker the garage spawnPosition

        jobs.markers.forEach((jobId) => {
            MarkerManager.addMarker(jobId, {
                id: jobId,
                color: { r: 0, g: 128, b: 0 },
                icon: 1,
                scale: { X: 3.0, Y: 3.0, Z: 2.0 },
                position: job.marker,
                type: 'job'
            });
        });

        const markersArray = Array.from(MarkerManager.getMarkers().values());

        if (markersArray.length <= 0) {
            emit('orion:showNotification', source, "Aucun marker n'a été trouvé");
            return;
        }
        emitNet('orion:marker:c:initializeMarkers', source, markersArray);
    });
})()
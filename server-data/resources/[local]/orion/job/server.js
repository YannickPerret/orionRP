(async => {
    const { Jobs } = require('./job/job');
    const JobsManager = require('./core/server/jobManager');
    const PlayerManager = require('./core/server/playerManager');

    onNet('orion:job:s:init', async () => {
        const source = global.source;
        const player = PlayerManager.getPlayerBySource(source);
        let jobMakers = [];
        await Jobs.getAll().then(async jobDb => {
            jobDb.forEach(job => {
                JobsManager.addJob(job);
                if (job.id === player.jobId) {
                    job.markers.forEach(marker => {
                        console.log(marker);
                    })
                }
            });
        });
    })

    onNet('orion:job:s:initialze', () => {
        const source = global.source;
        const player = PlayerManager.getPlayerBySource(source);
        const playerJob = JobsManager.getJobById(player.jobId);
    })

    onNet('orion:job:s:takeService', (jobId) => {
        const source = global.source;
        const job = JobsManager.getJobById(jobId);
    })

    onNet('orion:job:s:paycheck', (jobId) => {
        const source = global.source;
        const job = JobsManager.getJobById(jobId);
    })
})()
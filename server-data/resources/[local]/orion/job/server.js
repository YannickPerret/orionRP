(async => {
    const { Jobs } = require('./job/job');
    const JobsManager = require('./core/server/jobManager');
    const PlayerManager = require('./core/server/playerManager');

    onNet('orion:job:s:init', async () => {
        await Jobs.getAll().then(async jobDb => {
            jobDb.forEach(job => {
                JobsManager.addJob(job);
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
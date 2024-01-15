(async => {
    const { Jobs } = require('./job/job');
    const JobsManager = require('./core/server/jobManager');


    onNet('orion:job:s:init', async () => {
        await Jobs.getAll().then(async jobDb => {
            jobDb.forEach(job => {
                JobsManager.addJob(job);
            });
        });
    })
})()
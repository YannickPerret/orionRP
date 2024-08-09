const jobs = JSON.parse(LoadResourceFile(GetCurrentResourceName(), 'job/jobs.json'));
module.exports = {
    version: 18,
    migrate: async (db) => {
        // your code here
        console.log(jobs.jobs)
        jobs.jobs.forEach(async (job, index) => {
            await db.insert('jobs', {
                name: job.name,
                initial: job.initial,
                position: job.blips,
                markers: job.markers,
                storages: job.storages,
                grade: job.grade,
                maxGrade: job.maxGrade,
                spawnVehicle: job.spawnVehicle,
                spawnVehicleHeli: job.spawnVehicleHeli,
                enterCamera: job.enterCamera,
                cameras: job.cameras
            });
            console.log(`Job ${index} créée`);
        });
    }
};
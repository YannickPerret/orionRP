const jobs = LoadResourceFile(GetCurrentResourceName(), 'job/jobs.json').jobs;
module.exports = {
    version: 18,
    migrate: async (db) => {
        // your code here
        jobs.forEach(async (job, index) => {
            await db.insert('jobs', {
                name: job.name,
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
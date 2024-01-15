class JobManager {
    constructor() {
        this.jobs = new Map();
    }

    addJob(jobId, job) {
        if (!job.id) {
            console.log(`Erreur: le job ajouté n'a pas d'ID.`);
            return;
        }
        this.jobs.set(jobId, job);
    }

    getJobById(id) {
        return this.jobs.get(id);
    }

    getJobByPlayerId(playerId) {
        let result;
        this.jobs.forEach(job => {
            if (job.players.has(playerId)) {
                result = job;
            }
        });
        return result;
    }

    getJobs() {
        return this.jobs;
    }

    removeJob(id) {
        this.jobs.delete(id);
    }

    removeJobs() {
        this.jobs.clear();
    }

    async loadJobs() {
        const jobs = await db.getAll('jobs');
        jobs.forEach(job => {
            this.addJob(job.id, job);
        });
    }

}

module.exports = new JobManager;
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

    getJob(id) {
        return this.jobs.get(id);
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
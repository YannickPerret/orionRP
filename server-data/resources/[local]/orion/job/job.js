const { db, r } = require('../core/server/database.js');
const { v4: uuidv4 } = require('uuid');

class Job {
    constructor({ id, name, position, marker, grade, maxGrade }) {
        this.id = id || uuidv4();
        this.name = name || 'Chômage';
        this.blips = {
            color: 0,
            sprite: 0,
            x: 0,
            y: 0,
            z: 0
        } || position;
        this.marker = marker || [];
        this.grade = grade || [];
        this.maxGrade = maxGrade || 1;
    }

    static async getAll() {
        let result;
        try {
            result = await db.getAllWithMerge('jobs', 'jobs_grade', 'id');
        }
        catch (error) {
            console.error(error);
        }
        return result;
    }

    async save() {
        let result;
        try {
            if (await db.getById('jobs', this.id)) {
                result = await db.update('jobs', this.id, this);
            }
            else {
                result = await db.insert('jobs', this);
            }
        }
        catch (error) {
            console.error(error);
        }
        return result;
    }

}

class JobGrade {
    constructor(name, salary, access) {
        this.name = name || 'Chômeur';
        this.salary = salary || 0;
        this.accessProperty = access || new JobAccessProperty();
    }
}

class JobAccessProperty {
    constructor({ storage, vehicle }) {
        this.storage = storage || false;
        this.vehicle = vehicle || false;

    }
}

module.exports = {
    Job,
    JobGrade,
    JobAccessProperty
}
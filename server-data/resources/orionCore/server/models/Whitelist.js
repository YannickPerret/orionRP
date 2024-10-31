const {EntitySchema} = require("typeorm");

module.exports = new EntitySchema({
    name: "whitelist",
    tableName: "whitelist",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        guildId: {
            type: "varchar"
        },
        userId: {
            type: "varchar"
        }
    }
});
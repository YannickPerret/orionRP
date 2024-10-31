const { EntitySchema } = require('typeorm');

const RoleType = {
    ADMIN: 'admin',
    HELPER: 'helper',
    DEVELOPER: 'developer',
    GUEST: 'guest',
    USER: 'user',
};

module.exports = new EntitySchema({
    name: "Role",
    tableName: "roles",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        name: {
            type: "enum",
            enum: Object.values(RoleType),
            unique: true,
            nullable: false,
        },
    },
    relations: {
        users: {
            target: "User",
            type: "one-to-many",
            inverseSide: "role",
        },
    },
});

module.exports.RoleType = RoleType;

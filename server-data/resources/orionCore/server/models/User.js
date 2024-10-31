const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
      unique: true,
    },
    identifier: {
      type: "varchar",
      unique: true,
      nullable: false,
    },
    steamId: {
      type: "varchar",
      unique: true,
      nullable: true,
    },
    ip: {
      type: "varchar",
      nullable: true,
    },
    lastConnection: {
      type: "timestamp",
      nullable: true,
    },
    email: {
      type: "varchar",
      unique: true,
      nullable: false,
    },
    password: {
      type: "varchar",
      nullable: false,
    },
    username: {
      type: "varchar",
      unique: true,
      nullable: false,
    },
    active: {
      type: "boolean",
      default: false,
      nullable: false,
    },
    source: {
      type: "int",
      select: false,
    },
    activeCharacter: {
        type: "int",
        nullable: true,
    },
    createdAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    role: {
      target: "Role",
      type: "many-to-one",
      joinColumn: true,
    },
    characters: {
      target: "Character",
      type: "one-to-many",
      inverseSide: "user",
      cascade: true,
    },
  },
});

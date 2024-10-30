const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: "Character",
  tableName: "characters",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    userId: {
      type: "int",
      nullable: false,
    },
    name: {
      type: "varchar",
    },
    appearance: {
      type: "simple-json",
      nullable: true,
    },
    habits: {
      type: "simple-json",
      nullable: true,
    },
    position: {
      type: "simple-json",
      nullable: true,
    },
    hunger: {
      type: "float",
      default: 100,
    },
    thirst: {
      type: "float",
      default: 100,
    },
    health: {
      type: "float",
      default: 100,
    },
    armor: {
      type: "float",
      default: 0,
    },
    money: {
      type: "int",
      default: 0,
    },
    bank: {
      type: "int",
      default: 0,
    },
    createdAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    user: {
      target: "User",
      type: "many-to-one",
      joinColumn: { name: "userId" },
      inverseSide: "characters",
    },
    inventory: {
      target: "Inventory",
      type: "one-to-one",
      joinColumn: true,
      cascade: true,
    },
  },
});

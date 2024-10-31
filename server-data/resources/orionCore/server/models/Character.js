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
    model: {
      type: "varchar",
      nullable: true,
    },
    appearance: {
      type: "simple-json",
      nullable: true,
    },
    clothes: {
      type: "simple-json",
      nullable: true,
    },
    weapons: {
      type: "simple-json",
      nullable: true,
    },
    money: {
      type: "int",
      default: 500,
    },
    bank: {
      type: "int",
      default: 0,
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
    isDead: {
      type: "boolean",
      default: false,
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

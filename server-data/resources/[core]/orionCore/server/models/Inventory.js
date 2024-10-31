const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: "Inventory",
  tableName: "inventories",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    weight: {
      type: "float",
      default: 0,
    },
  },
  relations: {
    player: {
        target: "Character",
      type: "one-to-one",
      inverseSide: "inventory",
    },
    items: {
      target: () => "InventoryItem",
      type: "one-to-many",
      cascade: true,
      inverseSide: "inventory",
    },
  },
});

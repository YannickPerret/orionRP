const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: "InventoryItem",
  tableName: "inventory_items",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    quantity: {
      type: "int",
      default: 1,
    },
  },
  relations: {
    inventory: {
      target: () => "Inventory",
      type: "many-to-one",
      inverseSide: "items",
    },
    item: {
      target: () => "Item",
      type: "many-to-one",
    },
  },
});

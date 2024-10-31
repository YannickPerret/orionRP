const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: "Item",
  tableName: "items",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
      unique: true,
    },
    description: {
      type: "text",
    },
    image: {
      type: "varchar",
    },
    stackable: {
      type: "boolean",
      default: true,
    },
    usable: {
      type: "boolean",
      default: false,
    },
    effects: {
      type: "simple-json",
      nullable: true,
    },
    metadata: {
      type: "simple-json",
      nullable: true,
    },
  },
});

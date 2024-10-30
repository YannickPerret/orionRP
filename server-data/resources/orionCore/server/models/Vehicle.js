const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: "Vehicle",
  tableName: "vehicles",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    model: {
      type: "varchar",
    },
    state: {
      type: "simple-json",
      nullable: true,
    },
  },
  relations: {
    owner: {
      target: () => "Character",
      type: "many-to-one",
      inverseSide: "vehicles",
    },
  },
});

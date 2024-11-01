const { EntitySchema } = require('typeorm');
const UserGender = {
  MALE: 'male',
  FEMALE: 'female'
}

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
    firstName: {
      type: "varchar",
      nullable: false,
    },
    lastName: {
      type: 'varchar',
      nullable: false,
    },
    gender:{
      type: "enum",
      enum: Object.values(UserGender),
      default: UserGender.MALE,
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
      nullable: false,
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

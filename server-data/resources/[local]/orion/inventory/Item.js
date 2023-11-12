class Item {
  constructor(
    id,
    name,
    type,
    weight,
    price,
    quantity,
    description,
    useable,
    image,
    meta = undefined
  ) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.weight = weight;
    this.price = price;
    this.quantity = quantity;
    this.description = description;
    this.useable = useable;
    this.image = image;
    this.meta = meta;
  }

  getQuantity() {
    return this.quantity;
  }

  setQuantity(quantity) {
    this.quantity = quantity;
  }

  addQuantity(quantity) {
    this.quantity += quantity;
  }

  removeQuantity(quantity) {
    this.quantity -= quantity;
  }

  getName() {
    return this.name;
  }
}

export default Item;

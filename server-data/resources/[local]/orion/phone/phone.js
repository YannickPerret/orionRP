class Phone {
  constructor(number, player) {
    this.contacts = new Map();
    this.messages = new Map();
    this.calls = new Map();
    this.history = new Map();
    this.apps = new Map();
    this.number = number;
    this.player = player;
  }

  addContact(contact) {
    this.contacts.set(contact.number, contact);
  }
  removeContact(number) {
    this.contacts.delete(number);
  }
  getContact(number) {
    return this.contacts.get(number);
  }
  getContacts() {
    return this.contacts;
  }

  addMessage(message) {
    this.messages.set(message.id, message);
  }
  removeMessage(id) {
    this.messages.delete(id);
  }
  getMessage(id) {
    return this.messages.get(id);
  }
  getMessages() {
    return this.messages;
  }

  static async generateNewNumber() {
    let number = '555';
    const phonesNumber = await db.getByWithFilter('players', phone);

    for (let i = 0; i < 5; i++) {
      number += Math.floor(Math.random() * 10);
    }

    if (phonesNumber.includes(number)) {
      generatePhoneNumber();
    } else {
      return number;
    }
  }
}

module.exports = Phone;

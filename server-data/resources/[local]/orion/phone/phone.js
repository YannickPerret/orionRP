const { db, r } = require('../core/server/database.js');

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
    const phonesNumbers = await db.getFieldValues('players', 'phone');

    let number;
    do {
      number = '555' + Math.floor(1000 + Math.random() * 9000);
    } while (phonesNumbers.includes(number));

    console.log('New phone number generated : ', number);

    return number;
  }
}

module.exports = Phone;

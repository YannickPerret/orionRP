const { generatePhoneNumber } = require("../utils/phone.js");
const { db, r } = require("../system/database.js");

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

  generatePhoneNumber() {
    //use utils generate number and check is not already used with players.phone
    const number = generatePhoneNumber();
    //check if number is already used

    this.number = number;
    return number;
  }
}

module.exports = Phone;

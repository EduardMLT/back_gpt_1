const { futimes } = require("node:fs");
const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");

const filePath = path.join(__dirname, "./db/contacts.json");

async function readCont() {
    const data = await fs.readFile(filePath, { encoding: "utf-8" });
    return JSON.parse(data);
}

// readCont().then((data) => console.log(data, typeof data, "в списку = ", data.length, data[9]));

function writeCont(contact) {
    return fs.writeFile(filePath, JSON.stringify(contact, undefined, 2));
}

//  повертаємо масив контактів.

async function listContacts() {
  const contacts = await readCont();
  return contacts;
}

//  Повертаємо об'єкт контакту з таким id. Повертає null, якщо контакт з таким id не знайдений.

async function getContactById(id) {
  const contacts = await readCont();

  const contact = contacts.find((contact) => contact.id === id);

  return contact;
}

//  Повертаємо об'єкт доданого контакту.

async function addContact(name, email, phone) {
  const contacts = await readCont();
  const newCont = { id: crypto.randomUUID(), name, email, phone };

  contacts.push(newCont);

  await writeCont(contacts);

  return newCont; // створюємо новий контакт який повертаємо
}

// console.log(crypto.randomUUID());


// Змінюємо існуючий контакт

async function updateContact(id, name, email, phone) {
  const contacts = await readCont();
  const index = contacts.findIndex((contact) => contact.id === id); //перевіряємо чи є вже такий контакт

  if (index === -1) {
    return undefined;
  }

  const newContact = { id, name, email, phone };

  const newContacts = [
    ...contacts.slice(0, index),
    newContact,
    ...contacts.slice(index + 1),
  ];

  await writeCont(newContacts);

  return newContact;
}

//  Повертаємо об'єкт видаленого контакту. Повертає null, якщо контакт з таким id не знайдений.

async function removeContact(id) {
  const contacts = await readCont();
  const index = contacts.findIndex((contact) => contact.id === id); //перевіряємо чи є вже такий контакт

  if (index === -1) {
    return undefined;
  }

  const newContacts = [
    ...contacts.slice(0, index),
    ...contacts.slice(index + 1),
  ];

  await writeCont(newContacts);

  return contacts[index];
}

module.exports = {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
};
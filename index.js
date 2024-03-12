const Contacts = require('./contacts');

const { program } = require("commander");

program
  .option("-a, --action <action>", "choose action")
  .option("-i, --id <id>", "user id")
  .option("-n, --name <name>", "user name")
  .option("-e, --email <email>", "user email")
  .option("-p, --phone <phone>", "user phone");

program.parse(process.argv);

const argv = program.opts();

console.log('module ', argv);


// module.exports : 
//   listContacts, - list
//   getContactById, - get
//   addContact, - add
//   updateContact, - update
//   removeContact, - remove


async function invokeAction({ action, id, name, email, phone }) {
    switch (action) {
      case "list":
        const contacts = await Contacts.listContacts();
        return console.log(contacts, "contacts =", contacts.length);

      case "get":
        const contact = await Contacts.getContactById(id);
        return console.log(contact);

      case "add":
        const createContact = await Contacts.addContact(name, email, phone);
        return console.log(createContact);

      case "update":
        const updateContact = await Contacts.updateContact(
          id,
          name,
          email,
          phone
        );
        return console.log(updateContact);

      case "remove":
        const removeContact = await Contacts.removeContact(id);
        return console.log(removeContact);

      default:
        console.warn("\x1B[31m Unknown action type!");
    }
}

invokeAction(argv);
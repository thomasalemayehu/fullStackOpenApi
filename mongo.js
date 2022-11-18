/* eslint-disable no-undef */
const mongoose = require("mongoose");

if (process.argv.length >= 3) {
  const password = process.argv[2];

  const contactsSchema = mongoose.Schema({
    name: String,
    number: String,
  });
  const Contact = mongoose.model("Contact", contactsSchema);

  const url = `mongodb+srv://efpl:${password}@cluster0.4n1tggk.mongodb.net/contacts?retryWrites=true&w=majority`;

  if (process.argv.length >= 5) {
    const name = process.argv[3];
    const number = process.argv[4];
    mongoose
      .connect(url)
      .then(() => {
        return Contact({
          name,
          number,
        }).save();
      })
      .then(() => {
        console.log({ name: name, number: number }, "saved");
        mongoose.connection.close();
      })
      .catch((err) => console.log(err));
  } else if (process.argv.length === 3) {
    mongoose
      .connect(url)
      .then(() => {
        Contact.find({})
          .then((contacts) => {
            if (contacts) {
              contacts.forEach((contact) => console.log(contact));
            } else {
              console.log("No contacts found!");
            }
          })
          .then(() => mongoose.connection.close());
      })

      .catch((err) => console.log(err));
  }
} else {
  console.log(
    "Please provide the arguments: node mongo.js <password> <name> <number>"
  );
  process.exit(1);
}

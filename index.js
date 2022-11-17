const express = require("express");

const app = express();

app.use(express.json());
const PORT = 5000;

const contacts = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...contacts.map((n) => n.id)) : 0;
  return maxId + 1;
};

// get all contacts
app.get("/api/contacts", (request, response) =>
  response.status(200).json(contacts)
);

// get contact by ID
app.get("/api/contact/:id", (request, response) => {
  const id = request.params.id;

  const filteredContacts = contacts.filter(
    (contact) => contact.id.toString() == id
  );

  if (filteredContacts) {
    response.status(200).json(filteredContacts);
  } else {
    response.status(400).send("No data found");
  }
});

// delete contact by ID
app.delete("/api/contact/:id", (request, response) => {
  const id = request.params.id;

  const filteredContacts = contacts.filter(
    (contact) => contact.id.toString() !== id.toString()
  );

  response.status(200).json(filteredContacts);
});

// post
app.post("/api/contact", (request, response) => {
  const newContact = request.body;

  if (!newContact.name) {
    response.status(400).json({ error: "name is required" });
    return;
  } else if (!newContact.number) {
    response.status(400).json({ error: "number is required" });
    return;
  }

  const isNameExists =
    contacts.filter((contact) => contact.name == newContact.name).length > 0;

  if (isNameExists) {
    response.status(400).json({ error: "name must be unique" });
    return;
  }
  const newContacts = contacts.concat(newContact);

  response.status(200).json(newContacts);
});

// get phonebook info
app.get("/api/info", (request, response) => {
  response.status(200).send(
    `<h1>Phone book has info for ${contacts.length} people.</h1> 
        <h4>  ${new Date()} </h4>
        `
  );
});

app.listen(PORT, () => {
  console.log(`Server is live @ ${PORT}`);
});

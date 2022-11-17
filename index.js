const express = require("express");

const app = express();
const cors = require("cors");
const morgan = require("morgan");

app.use(express.json());
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(
    ":method :url :status :req[content-length] - :response-time ms - :res[content-length] :body"
  )
);

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.static("build"));


const PORT = process.env.PORT || 3001;

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
  return Math.floor(Math.random() * (1000 - 8 + 1) + 8);
};

// get all contacts
app.get("/api/contacts", (request, response) => {
  response.status(200).json(contacts);

  return;
});

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
    contacts.filter((contact) => contact.name === newContact.name).length > 0;


  if (isNameExists) {
    response.status(600).json({ error: "name must be unique" });
    return;
  }
  const newContacts = contacts.concat({ id: generateId(), ...newContact });

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

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const Contact = require("./models/Contact");

const app = express();

require("dotenv").config();

app.use(express.json());
morgan.token("body", (req) => JSON.stringify(req.body));
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

const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    return response.status(400).send({ error: "Malformed ID" });
  } else if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  }
  console.error(error.name);
  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3000;

// get all contacts
app.get("/api/contacts", (_, response, next) => {
  Contact.find({})
    .then((contacts) => {
      if (contacts.length > 0) {
        response.status(200).json(contacts);
      } else {
        response.status(404).json({ message: "No data found" });
      }
    })
    .catch((e) => next(e));

  return;
});

// get contact by ID
app.get("/api/contact/:id", (request, response, next) => {
  const id = request.params.id;

  Contact.find({ _id: id })
    .then((contacts) => {
      if (contacts.length > 0) {
        response.status(200).json(contacts);
      } else {
        response.status(404).json({ message: "No data found" });
      }
    })
    .catch((e) => next(e));

  return;
});

// update contact by ID
app.put("/api/contact/:id", (request, response, next) => {
  const id = request.params.id;

  Contact.findByIdAndUpdate(id, request.body, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then(() => {
      console.log("Phonebook updated");
      Contact.find({}).then((contacts) => response.status(200).json(contacts));
    })
    .catch((error) => next(error));
});

// // delete contact by IDx
app.delete("/api/contact/:id", (request, response, next) => {
  const id = request.params.id;

  Contact.findByIdAndRemove(id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// post
app.post("/api/contact", (request, response, next) => {
  const { name, number } = request.body;

  Contact.find().then((fetchedContacts) => {
    const isNameExists =
      fetchedContacts.filter(
        (contact) =>
          contact.name.toString().toUpperCase() ===
          name.toString().toUpperCase()
      ).length > 0;

    if (isNameExists) {
      response
        .status(400)
        .json({ error: `Contact ${name} - ${number} already exists` });
      return;
    }

    const newContact = new Contact({
      name,
      number,
    });

    newContact
      .save()
      .then((result) => {
        console.log("Phonebook saved!");
        response.status(200).json(fetchedContacts.concat(result));
      })
      .catch((e) => next(e));
  });

  return;
});

// get phonebook info
app.get("/api/info", (_,response, next) => {
  Contact.find({}).then((contacts) => {
    if (contacts.length > 0) {
      response.status(200).send(
        `<h1>Phone book has info for ${contacts.length} people.</h1>
        <h4>  ${new Date()} </h4>
        `
      );
    } else {
      response.status(404).send(
        `<h1>No contacts in phonebook</h1>
        <h4>  ${new Date()} </h4>
        `
      );
    }
  }).catch((e) => next(e));
});

// this has to be the last loaded middleware.s
// handler of requests with unknown endpoint
app.use(unknownEndpoint);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server is live @ ${PORT}`);
});

const mongoose = require("mongoose");

const URL =
  // eslint-disable-next-line no-undef
  process.env.URI ||
  "mongodb+srv://efpl:zWZ5XSHdZ0ELDuOA@cluster0.4n1tggk.mongodb.net/contacts?retryWrites=true&w=majority";

const contactSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name of a contact is required"],
    minLength: [3, "Name must be at least 3 character"],
    maxLength: [128, "Name must not exceed 128 character"],
  },
  number: {
    type: String,
    required: [true, "Phone number of a contact is required"],
    minLength: [8, "Phone number must at least 8"],
    maxLength: [20, "Phone number must not exceed 20"],
    validate: {
      validator: function (v) {
        return /\d{3}-\d{3}-\d{4}/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number`,
    },
  },
});

mongoose
  .connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

contactSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;

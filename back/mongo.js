const { mongoose, User } = require("./models/users");

// Connessione al database

const password = process.env.PASSWORD;
const user = process.env.USER;
const namProj = process.env.NAMEPROJECT;

const uri = "mongodb+srv://" + user + ":" + password + "@cluster0.swcrutq.mongodb.net/" + namProj + "?retryWrites=true&w=majority";
mongoose
    .connect(uri)
    .then(() => ("Collegato a MongoDB"))
    .catch((err) => resizeBy.send(message + "Errore di connessione a MongoDB: " + err));


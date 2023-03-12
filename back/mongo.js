const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator")

// Connessione al database

const password = process.env.PASSWORD;
const user = process.env.USER;
const namProj = process.env.NAMEPROJECT;

const uri = "mongodb+srv://" + user + ":" + password + "@cluster0.swcrutq.mongodb.net/" + namProj + "?retryWrites=true&w=majority";
mongoose
    .connect(uri)
    .then(() => ("Collegato a MongoDB"))
    .catch((err) => resizeBy.send(message +"Errore di connessione a MongoDB: " + err));


// Definizione dello schema e del modello User
const userSchema = new mongoose.Schema({
    email:{ type : String, require : true , unique : true},
    password: { type : String, require : true }
});
userSchema.plugin(uniqueValidator)

const User = mongoose.model("User", userSchema);

module.exports = {mongoose,User}
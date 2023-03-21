const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
    email:{ type : String, require : true , unique : true},
    password: { type : String, require : true }
});

userSchema.plugin(uniqueValidator);
const User = mongoose.model("User", userSchema);

module.exports = {mongoose, User};

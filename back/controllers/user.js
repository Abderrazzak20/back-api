const User = require("../mongo").User;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function createUser(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = await hashPassword(password);
  const user = new User({ email: email, password: hashedPassword });

  try {
    const savedUser = await user.save();
    ("User salvato:", savedUser);
    res.status(201).send({ message: "Utente registrato" });
  } catch (err) {
    ("Errore nel salvataggio dell'utente:", err);
    res.status(500).send({ message: "Errore nel salvataggio dell'utente" });
  }
}

function hashPassword(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

async function logUser(req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email: email });
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      res.status(403).send({ message: "Password incorretta" });
    } else {
      const token = createToken(email);
      res.status(200).send({ userId: user._id, token: token });
    }
    ("isPasswordCorrect", isPasswordCorrect);
    ("user", user);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Errore interno" });
  }
}

function createToken(email) {
  const jwtPassword = process.env.JWTPASSWORD;
  const token = jwt.sign({ email: email }, jwtPassword, { expiresIn: "24h" });
  ("token:", token);
  return token;
}

module.exports = { createUser, logUser };

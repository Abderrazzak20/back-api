const jwt = require("jsonwebtoken")
function authenticateUser(req, res, next) {
  // Verifica la presenza dell'header Authorization
  const header = req.header("Authorization");
  if (header == null) {
  return res.status(403).send({ message: "Invalid request" });
  }
  
  // Estrae il token dal valore dell'header
  const token = header.split(" ")[1];
  if (token == null) {
  return res.status(403).send({ message: "Token cannot be null" });
  }
  
  // Verifica il token utilizzando la chiave segreta
  jwt.verify(token, process.env.JWTPASSWORD, (err, decoded) => {
  if (err) {
  return res.status(403).send({ message: "Invalid token" });
  }
  
  // Se il token è valido, passa il controllo alla successiva middleware
  next();
  });
  }
  module.exports = {authenticateUser}
const { unlink } = require("fs/promises")
const Product = require("../models/SauceObject")

function getSauces(req, res) {
  Product.find({})
    .then((sauce) => {
      res.send(sauce);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
}

function getSauce(req, res) {
  const { id } = req.params
  return Product.findById(id)
}

function getSauceById(req, res) {
  getSauce(req, res)
    .then((product) => {
      if (!product) {
        return res.status(404).send({ message: "object not found" })
      }
      return res.send(product);
    })
    .catch((err) => res.status(500).send(err))
}

function deleteSauce(req, res) {
  const { id } = req.params;
  Product.findByIdAndDelete(id)
    .then((product) => {
      sendClientResponse(product, res);
      return deleteImage(product);
    })
    .then(() => {
      console.log("FILE DELETED");
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
}

function deleteImage(product) {
  if (product == null) return
  const imageToDelete = product.imageUrl.split("/").at(-1)
  return unlink("images/" + imageToDelete)
}

function ModifySauces(req, res) {
  const { params: { id } } = req
  const hasNewImage = req.file != null
  const payload = makePayload(hasNewImage, req)

  Product.findByIdAndUpdate(id, payload)
    .then((dbResponse) => sendClientResponse(dbResponse, res))
    .then((product) => deleteImage(product))
    .catch((err) => console.error("problem updatting", err))
}

function makePayload(hasNewImage, req) {
  if (!hasNewImage) {
    return req.body;
  }
  const payload = JSON.parse(req.body.sauce);
  payload.imageUrl = makeImageUrl(req, req.file.fileName);
  return payload;
}

function sendClientResponse(product, res) {
  if (product == null) {
    return res.status(404)
      .send({ message: "Object not found in database" })
  }
  return Promise.resolve(res.status(200).send(product))
    .then(() => product)
}

function makeImageUrl(req, fileName) {
  return req.protocol + "://" + req.get("host") + "/images/" + fileName
}

function createSauces(req, res) {
  const { body, file } = req
  const { fileName } = file
  const sauce = JSON.parse(body.sauce)
  const { name, manufacturer, mainPepper, description, heat, userId } = sauce
  const product = new Product({
    userId: userId,
    name: name,
    manufacturer: manufacturer,
    description: description,
    mainPepper: mainPepper,
    imageUrl: makeImageUrl(req, fileName),
    heat: heat,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  })
  product.save()
    .then((message) => res.status(201).send({ message: message }))
    .catch((err) => res.status(500).send(err))
}

function likeSauces(req, res) {
  const { like, userId } = req.body;

  // Verifica che il valore di like sia valido
  if (![1, -1, 0].includes(like)) {
    return res.status(403).send({ message: "invalid like value" });
  }

  // Cerca il prodotto nel database
  getSauce(req, res)
    .then((product) => {
      const { usersLiked, usersDisliked } = product;

      // Aggiunge un like
      if (like === 1) {
        if (!usersLiked.includes(userId)) {
          product.likes++;
          product.usersLiked.push(userId);
        }
      }
      // Aggiunge un dislike
      else if (like === -1) {
        if (!usersDisliked.includes(userId)) {
          product.dislikes++;
          product.usersDisliked.push(userId);
        }
      }
      // Rimuove un like o un dislike
      else {
        if (usersLiked.includes(userId)) {
          product.likes--;
          product.usersLiked = usersLiked.filter((id) => id !== userId);
        } else if (usersDisliked.includes(userId)) {
          product.dislikes--;
          product.usersDisliked = usersDisliked.filter((id) => id !== userId);
        } else {
          // L'utente non ha votato
          return res.status(403).send({ message: "user seems to have not voted" });
        }
      }

      // Salva il prodotto nel database
      return product.save();
    })
    .then((prod) => sendClientResponse(prod, res))
    .catch((err) => res.status(500).send(err));
}

module.exports = { getSauces, createSauces, getSauceById, deleteSauce, ModifySauces, likeSauces }


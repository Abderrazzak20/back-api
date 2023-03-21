
const { unlink } = require("fs/promises")

const Product = require("../models/SauceObject")



function getSauces(req, res) {
  Product.find({})
    .then((sauce) => res.send(sauce))
    .catch((error) => res.status(500).send(error))
}


function getSauce(req, res) {
  const { id } = req.params
  return Product.findById(id)
}

function getSauceById(req, res) {
  getSauce(req, res)
    .then((product) => {
      if (!product) {
        return res.status(404).send({ message: "oggetto non trovato" })
      }
      return res.send(product);
    })
    .catch((err) => res.status(500).send(err))
}


function deleteSauce(req, res) {
  const { id } = req.params
  Product.findByIdAndDelete(id)
    .then((product) => sendClientResponse(product, res))
    .then((item) => deleteImage(item))
    .then((res) => console.log("FILE DELETED", res))
    .catch((err) => res.status(500).send({ message: err }))
}

function deleteImage(product) {
  if (product == null) return
  console.log("DELETE IMAGE", product)
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
    .then((res) => console.log("file a eliminare", res))
    .catch((err) => console.error("problem updatting", err))
}






function makePayload(hasNewImage, req) {
  if (!hasNewImage) return req.body
  const payload = JSON.parse(req.body.sauce)
  payload.imageUrl = makeImageUrl(req, req.file.fileName)
  console.log("nuovo immagini a gestire")
  console.log("ecco il pyaload", payload)
  return payload

}

function sendClientResponse(product, res) {
  if (product == null) {
    console.log("NOTHING TO UPDATE")
    return res.status(404).send({ message: "Object not found in database" })
  }
  console.log("ALL GOOD, UPDATING:", product)
  return Promise.resolve(res.status(200).send(product)).then(() => product)
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
  product
    .save()
    .then((message) => res.status(201).send({ message: message }))
    .catch((err) => res.status(500).send(err))

}


function likeSauces(req, res) {
  const { like, userId } = req.body

  if (![1, -1, 0].includes(like)) return res.status(403).send({ message: "invalid like value" })
  getSauce(req, res)
    .then((product) => updateVote(product, like, userId, res))
    .then((pr) => pr.save())
    .then((prod) => sendClientResponse(prod, res))
    .catch((err) => res.status(500).send(err))
}



function incrementVote(product, userId, like) {
  const { usersLiked, usersDisliked } = product;
  let votersArray, oppositeArray;
  if (like === 1) {
    votersArray = usersLiked;
    oppositeArray = usersDisliked;
  } else {
    votersArray = usersDisliked;
    oppositeArray = usersLiked;
  }
  if (votersArray.includes(userId)) return product;
  votersArray.push(userId);
  if (oppositeArray.includes(userId)) {
    const oppositeIndex = oppositeArray.indexOf(userId);
    oppositeArray.splice(oppositeIndex, 1);
    like === 1 ? ++product.likes : ++product.dislikes;
  } else {
    like === 1 ? ++product.likes : ++product.dislikes;
  }
  return product;
}


function updateVote(product, like, userId, res) {
  if (like === 1 || like === -1) return incrementVote(product, userId, like)
  return resetVote(product, userId, res)
}

function resetVote(product, userId, res) {
  const { usersLiked, usersDisliked } = product
  if ([usersLiked, usersDisliked].every((arr) => arr.includes(userId)))
    return Promise.reject("user seems to have voted both ways")

  if (![usersLiked, usersDisliked].some((arr) => arr.includes(userId)))
    return Promise.reject("user seems to have  not voted")

  if (usersLiked.includes(userId)) {
    --product.likes
    product.usersLiked = product.usersLiked.filter((id) => id !== userId)
  }
  else {
    --product.dislikes
    product.usersDisliked = product.usersDisliked.filter((id) => id !== userId)

  }
  return product
}




module.exports = { getSauces, createSauces, getSauceById, deleteSauce, ModifySauces, likeSauces }







const mongoose = require("mongoose")
const productSchema = new mongoose.Schema({
    userId: String,
    name: String,
    manufacturer: String,
    description: String,
    mainPepper: String,
    imageUrl: String,
    heat: Number,
    likes: Number,
    dislikes: Number,
    userLiked:[String],
    userDisliked:[String]
})

const Product = mongoose.model("Product",productSchema)

function getSauces(req,res){
   Product.find({})
   
   .then((products)=> res.send(products))

   .catch((error) => res.status(500).send(error))
}

function deletesauce(req, res) {
  const { id } = req.params
  Product.findByIdAndDelete(id)
    .then((product) => res.send({ message: "product deleted" }))
    .catch(err => res.status(500).send({ message: err }))
}

  
  
   function getSauceById(req, res) {

      const { id } = req.params
     Product.findById(id)
      .then ((product) => {
        console.log({product})
          res.send(product)
      })
    .catch(console.error) 
  }

  function makeImageUrl(req, fileName) {
    return req.protocol + "://" + req.get("host") + "/images/" + fileName
  }

function createSauces(req,res){
    const {body,file} = req
  const {fileName} = file  
const sauce = JSON.parse(body.sauce)
const {name,manufacturer,mainPepper,description,heat,userId} = sauce
    console.log({body,file}) // stampa l'intero oggetto req.body per visualizzare tutti i dati
    const product = new Product({
        userId: userId,
        name : name ,
        manufacturer : manufacturer,
        description : description,
        mainPepper: mainPepper,
        imageUrl : makeImageUrl(req,fileName),
        heat : heat,
        likes: 0,
        dislikes: 0,
        userLiked:[],
        userDisliked:[]
    })
    product
    .save()
    .then((message)=> {
        res.status(201).send({message : message });
        return console.log("produit registrato", message)
    })
    .catch(console.error)
}




module.exports = {getSauces,createSauces,getSauceById,deletesauce}

const {app,express} = require("./server")
const port = 3000;
require("./mongo");
const {upload} = require("./middleware/multer")

const path = require("path")
// connessione database
require("./mongo")

// controllers
const {createUser,logUser} = require("./controllers/user")
const { getSauces, createSauces, getSauceById, deletesauce  } = require("./controllers/sauces");



const{authenticateUser} = require("./middleware/auth")

// Rotte
app.post("/api/auth/signup", createUser);
app.post("/api/auth/login", logUser);
app.get("/api/sauces", authenticateUser, getSauces);
app.post("/api/sauces",authenticateUser , upload.single("image"),createSauces)
app.get("/api/sauces/:id",authenticateUser,getSauceById)
app.delete("/api/sauces/:id",authenticateUser, deletesauce)
app.get("/",(req,res)=>res.send("hello world"))

// Avvio del server
app.use("/images", express.static(path.join(__dirname, "images")))
app.listen(port, () => console.log("Server in ascolto sulla porta", port));

const {app,express} = require("./server")
const {saucesRouter} = require("./router/sauce")
const {authRouter} = require("./router/auth")
const port = 3000;
require("./mongo");
const path = require("path")

// connessione database
require("./mongo")

// middleware

app.use("/api/sauces",saucesRouter)
app.use("/api/auth",authRouter)

// Rotte

app.get("/",(req,res)=>res.send("hello world"))

// Avvio del server
app.use("/images", express.static(path.join(__dirname, "images")))
app.listen(port, () => console.log("Server in ascolto sulla porta", port));

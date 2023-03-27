const express = require("express");
const { getSauces, createSauces, getSauceById, ModifySauces, deleteSauce, likeSauces } = require("../controllers/sauces")
const { authenticateUser } = require("../middleware/auth")
const { upload } = require("../middleware/multer")
const saucesRouter = express.Router()

saucesRouter.get("/", authenticateUser, getSauces);
saucesRouter.post("/", authenticateUser, upload.single("image"), createSauces)
saucesRouter.get("/:id", authenticateUser, getSauceById)
saucesRouter.delete("/:id", authenticateUser, deleteSauce)
saucesRouter.put("/:id", authenticateUser, upload.single("image"), ModifySauces);
saucesRouter.post("/:id/like", authenticateUser, likeSauces)

module.exports = { saucesRouter }

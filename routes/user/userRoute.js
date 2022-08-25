const express = require('express')
const router = express.Router()
const UserController = require("../../controllers/user/UserController")


router.get("/", UserController.handleGetUser)

module.exports = router
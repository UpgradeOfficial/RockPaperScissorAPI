const express = require('express')
const router = express.Router()
const LoginController = require("../../controllers/auth/LoginController")


router.post("/", LoginController.handleLogin)

module.exports = router
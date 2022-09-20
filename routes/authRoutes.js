const express = require("express");
const router = express.Router();
const upload = require("../utils/multer")
const authController = require("../controllers/authController");
const loginLimiter = require("../middleware/loginLimiter");

router.route("/login").post(loginLimiter, authController.login);

router.route("/refresh").post(authController.refresh);

router.route("/logout").post(authController.logout);

router.route("/register").post(upload.single("image"),authController.createNewUser);

router.get("/verify/token", authController.verifyUserEmail);

module.exports = router;

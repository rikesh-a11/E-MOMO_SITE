const { registerUSer, loginUser, forgotPassword } = require("../../controllers/auth/authController")

const router = require("express").Router()

//routes here
router.route("/register").post(registerUSer)
router.route("/login").post(loginUser)
router.route("/forgotPassword").post(forgotPassword)


module.exports = router
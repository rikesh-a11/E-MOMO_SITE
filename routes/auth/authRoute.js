const { registerUSer, loginUser } = require("../../controllers/auth/authController")

const router = require("express").Router()

//routes here
router.route("/register").post(registerUSer)
router.route("/login").post(loginUser)


module.exports = router
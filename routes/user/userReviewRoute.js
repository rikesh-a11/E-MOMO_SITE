const { getProductReview, createReview, deleteReview, addProductReview } = require("../../controllers/user/review/userController")
const isAuthenticated = require("../../middleware/isAuthenticated")
const catchAsync = require("../../services/catchAsync")

const router = require("express").Router()

router.route("/reviews/:id").get(getProductReview).delete(isAuthenticated,deleteReview).post(isAuthenticated,addProductReview)

module.exports = router
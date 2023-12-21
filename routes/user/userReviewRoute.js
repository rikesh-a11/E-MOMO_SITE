
const { getMyReviews, deleteReview, createReview } = require("../../controllers/user/review/reviewController")
const isAuthenticated = require("../../middleware/isAuthenticated")
const restrictTo = require("../../middleware/restrictTo")
const catchAsync = require("../../services/catchAsync")

const router = require("express").Router()

router.route("/").get(isAuthenticated,catchAsync(getMyReviews))
router.route("/:id").delete(isAuthenticated,catchAsync(deleteReview)).post(isAuthenticated,catchAsync(createReview))

module.exports = router
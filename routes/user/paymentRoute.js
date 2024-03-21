const {
  verifyPidx, initiateKhaltiPayment,
} = require("../../controllers/user/payment/paymentController");
const isAuthenticated = require("../../middleware/isAuthenticated");
const catchAsync = require("../../services/catchAsync");

const router = require("express").Router();

router.route("/").post(isAuthenticated, catchAsync(initiateKhaltiPayment));
router.route("/verifypidx").post(isAuthenticated, catchAsync(verifyPidx));

module.exports = router;

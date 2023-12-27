const { updateOrderStatus } = require("../../controllers/admin/order/orderController")
const { getMyOrders, createOrder, deletMyOrder, cancelOrder } = require("../../controllers/user/order/orderController")
const isAuthenticated = require("../../middleware/isAuthenticated")
const catchAsync = require("../../services/catchAsync")

const router = require("express").Router()

router.route('/').get(isAuthenticated,catchAsync(getMyOrders)).post(isAuthenticated,catchAsync(createOrder))
router.route('/cancel').patch(isAuthenticated,catchAsync(cancelOrder))
router.route('/:id').patch(isAuthenticated,catchAsync(updateOrderStatus)).delete(isAuthenticated,catchAsync(deletMyOrder))

module.exports = router
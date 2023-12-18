const { createProduct } = require("../../controllers/admin/product/productController")
const isAuthenticated = require("../../middleware/isAuthenticated")
const restrictTo = require("../../middleware/restrictTo")

const router = require("express").Router()
const { multer,storage } = require("../../middleware/multerCongif")
const catchAsync = require("../../services/catchAsync")
const upload = multer({storage : storage})



router.route("/product").post(isAuthenticated,restrictTo("admin"),upload.single('productImage'), catchAsync(createProduct))

module.exports = router
const {
  createProduct,
  deleteProduct,
  editProduct,
} = require("../../controllers/admin/product/productController");
const isAuthenticated = require("../../middleware/isAuthenticated");
const restrictTo = require("../../middleware/restrictTo");

const router = require("express").Router();
const { multer, storage } = require("../../middleware/multerCongif");
const catchAsync = require("../../services/catchAsync");
const { getProduct, getProducts } = require("../../controllers/global/globalController");
const upload = multer({ storage: storage });

//products
router
  .route("/")
  .post(
    isAuthenticated,
    restrictTo("admin"),
    upload.single("productImage"),
    catchAsync(createProduct)
  )
  .get(catchAsync(getProducts));

//single product
router
  .route("/:id")
  .get(catchAsync(getProduct))
  .delete(isAuthenticated, restrictTo("admin"), catchAsync(deleteProduct))
  .patch(
    isAuthenticated,
    restrictTo("admin"),
    upload.single("productImage"),
    catchAsync(editProduct)
  );

module.exports = router;

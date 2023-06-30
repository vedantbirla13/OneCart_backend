const express = require("express")
const { createProduct, deleteProduct, getProducts, getAllProducts, reviewProduct } = require("../controllers/product.js");
const { isAuthenticated, isSellerAuthenticated } = require("../middleware/auth.js")
const { upload } = require("../multer.js") 

const router = express.Router();

router.post("/create-product", upload.array("images") , createProduct)

router.get("/get-all-products-shop/:id", getProducts)

router.delete("/delete-shop-product/:id", isSellerAuthenticated, deleteProduct)

router.get("/get-all-products", getAllProducts)

router.post("/review-product", isAuthenticated , reviewProduct)

module.exports = router;
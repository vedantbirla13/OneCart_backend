import express from "express"
import { createProduct, deleteProduct, getProducts, getAllProducts, reviewProduct } from "../controllers/product.js";
import { isAuthenticated, isSellerAuthenticated } from "../middleware/auth.js"
import { upload } from "../multer.js" 

const router = express.Router();

router.post("/create-product", upload.array("images") , createProduct)

router.get("/get-all-products-shop/:id", getProducts)

router.delete("/delete-shop-product/:id", isSellerAuthenticated, deleteProduct)

router.get("/get-all-products", getAllProducts)

router.post("/review-product", isAuthenticated , reviewProduct)

export default router;
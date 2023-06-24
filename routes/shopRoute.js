import express from "express"
import { upload } from "../multer.js";
import { createShop, activateShop, loginShop, getSeller, logoutShop, getShopInfo, updateShopAvatar, updateShopInfo } from "../controllers/shop.js";
import { isAuthenticated, isSellerAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/create-shop", upload.single("file") , createShop)

router.post("/activation", activateShop)

router.post("/login-shop", loginShop)

router.get("/getSeller", isSellerAuthenticated, getSeller)

router.get("/logoutSeller", logoutShop)

router.get("/get-shop-info/:id", getShopInfo)

router.put("/update-shop-avatar", isSellerAuthenticated, upload.single("image"), updateShopAvatar)

router.put("/update-shop-info", isSellerAuthenticated, updateShopInfo)

export default router
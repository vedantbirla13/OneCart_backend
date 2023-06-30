const express = require("express")
const { upload } = require("../multer.js");
const { createShop, activateShop, loginShop, getSeller, logoutShop, getShopInfo, updateShopAvatar, updateShopInfo } = require("../controllers/shop.js");
const { isAuthenticated, isSellerAuthenticated } = require("../middleware/auth.js");

const router = express.Router();

router.post("/create-shop", upload.single("file") , createShop)

router.post("/activation", activateShop)

router.post("/login-shop", loginShop)

router.get("/getSeller", isSellerAuthenticated, getSeller)

router.get("/logoutSeller", logoutShop)

router.get("/get-shop-info/:id", getShopInfo)

router.put("/update-shop-avatar", isSellerAuthenticated, upload.single("image"), updateShopAvatar)

router.put("/update-shop-info", isSellerAuthenticated, updateShopInfo)

module.exports = router
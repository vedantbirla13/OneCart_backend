const express = require("express")
const { upload } = require("../multer.js");
const { isSellerAuthenticated } = require("../middleware/auth.js");
const { createCoupon, deleteCoupon, getCoupon, getCouponValue } = require("../controllers/coupon.js");

const router = express.Router();

router.post("/create-coupon", isSellerAuthenticated, createCoupon)

router.get("/get-coupon/:id", isSellerAuthenticated, getCoupon)

router.delete("/delete-coupon/:id" , isSellerAuthenticated, deleteCoupon)

router.get("/get-coupon-value/:name", getCouponValue)

module.exports = router;
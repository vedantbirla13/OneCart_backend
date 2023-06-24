import express from "express"
import { upload } from "../multer.js";
import { isSellerAuthenticated } from "../middleware/auth.js";
import { createCoupon, deleteCoupon, getCoupon, getCouponValue } from "../controllers/coupon.js";

const router = express.Router();

router.post("/create-coupon", isSellerAuthenticated, createCoupon)

router.get("/get-coupon/:id", isSellerAuthenticated, getCoupon)

router.delete("/delete-coupon/:id" , isSellerAuthenticated, deleteCoupon)

router.get("/get-coupon-value/:name", getCouponValue)

export default router;
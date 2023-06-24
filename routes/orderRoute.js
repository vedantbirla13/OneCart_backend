import express from "express"
import { isSellerAuthenticated } from "../middleware/auth.js";
import { RefundSuccess, RefundUser, createOrder, getAllOrders, getAllSellerOrders, updateOrderStatus } from "../controllers/order.js"

const router = express.Router();

router.post("/create-order",  createOrder)

router.get("/get-all-orders/:userId",  getAllOrders)

router.get("/get-all-seller-orders/:shopId",  getAllSellerOrders)

router.put("/update-order-status/:id", isSellerAuthenticated, updateOrderStatus)

router.put("/refund-user/:id", isSellerAuthenticated, RefundUser)

router.put("/refund-user-success/:id", isSellerAuthenticated, RefundSuccess)

export default router
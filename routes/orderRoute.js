const express = require("express")
const { isSellerAuthenticated } = require("../middleware/auth.js");
const { RefundSuccess, RefundUser, createOrder, getAllOrders, getAllSellerOrders, updateOrderStatus } = require("../controllers/order.js")

const router = express.Router();

router.post("/create-order",  createOrder)

router.get("/get-all-orders/:userId",  getAllOrders)

router.get("/get-all-seller-orders/:shopId",  getAllSellerOrders)

router.put("/update-order-status/:id", isSellerAuthenticated, updateOrderStatus)

router.put("/refund-user/:id", isSellerAuthenticated, RefundUser)

router.put("/refund-user-success/:id", isSellerAuthenticated, RefundSuccess)

module.exports = router
const express = require("express")
const { paymentProcess, getApiKey } = require("../controllers/payment.js")

const router = express.Router();

router.post("/process" , paymentProcess)

router.get("/stripeapikey", getApiKey)

module.exports = router

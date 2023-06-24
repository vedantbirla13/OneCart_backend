import express from "express"
import { paymentProcess, getApiKey } from "../controllers/payment.js"

const router = express.Router();

router.post("/process" , paymentProcess)

router.get("/stripeapikey", getApiKey)

export default router

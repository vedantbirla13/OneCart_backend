import { CatchAsyncErrors } from "../middleware/CatchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import dotenv from "dotenv"

dotenv.config({
    path: "./config/config.env",
});



export const paymentProcess = CatchAsyncErrors(async(req,res,next) => {
    try {
        const myPayment = await stripe.paymentIntents.create({
            amount: req.body.amount,
            currency: "inr",
            payment_method_types: ['card'],
        });

        res.status(200).json({
            success: true,
            client_secret: myPayment.client_secret
        })
    } catch (error) {
        return next (new ErrorHandler(error.message, 500))
        
    }
})

export const getApiKey = CatchAsyncErrors(async(req,res,next) => {
    res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
})
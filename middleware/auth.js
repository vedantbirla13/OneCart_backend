import Shop from "../models/Shop.js";
import User from "../models/User.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { CatchAsyncErrors } from "./CatchAsyncErrors.js";
import jwt from "jsonwebtoken"

export const isAuthenticated = CatchAsyncErrors(async(req,res,next) => {
    const { token } = req.cookies
    
    if(!token){
        return next(new ErrorHandler("Please login to continue!!", 400))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = await User.findById(decoded.id)

    next()
}) 


export const isSellerAuthenticated = CatchAsyncErrors(async(req,res,next) => {
    const { Shop_token } = req.cookies
    
    if(!Shop_token){
        return next(new ErrorHandler("Please login to continue!!", 400))
    }

    const decoded = jwt.verify(Shop_token, process.env.JWT_SECRET_KEY);

    req.seller = await Shop.findById(decoded.id)

    next()
}) 


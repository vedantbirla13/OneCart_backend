const Shop = require("../models/Shop.js");
const User = require("../models/User.js");
const ErrorHandler = require("../utils/ErrorHandler.js");
const  CatchAsyncErrors  = require("../middleware/CatchAsyncErrors.js");
const jwt = require("jsonwebtoken")

 const isAuthenticated = CatchAsyncErrors(async(req,res,next) => {
    const { token } = req.cookies
    
    if(!token){
        return next(new ErrorHandler("Please login to continue!!", 400))
    }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
        req.user = await User.findById(decoded.id)
    
        next()
}) 


 const isSellerAuthenticated = CatchAsyncErrors(async(req,res,next) => {
    const { Shop_token } = req.cookies
    
    if(!Shop_token){
        return next(new ErrorHandler("Please login to continue!!", 400))
    }

    const decoded = jwt.verify(Shop_token, process.env.JWT_SECRET_KEY);

    req.seller = await Shop.findById(decoded.id)

    next()
}) 

module.exports = {
    isAuthenticated, isSellerAuthenticated
}

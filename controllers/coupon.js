const  CatchAsyncErrors  = require("../middleware/CatchAsyncErrors.js");
const CouponCode = require("../models/CouponCode.js");
const Shop = require("../models/Shop.js");
const ErrorHandler = require("../utils/ErrorHandler.js");

const createCoupon = CatchAsyncErrors(async (req, res, next) => {
  try {
    const couponExist = await CouponCode.find({ name: req.body.name });

    if (couponExist.length !== 0) {
      return next(new ErrorHandler("Coupon code already exists, 401"));
    }

    const coupon = await CouponCode.create(req.body);

    res.status(201).json({
      success: true,
      coupon,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

const getCoupon =  CatchAsyncErrors(async(req,res,next) => {
    try {

      const coupon = await CouponCode.find({ shopId : req.seller.id  })

      res.status(200).json({
        success:true,
        coupon
      })
      
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
    }
})

const deleteCoupon = CatchAsyncErrors(async(req,res,next) => {
  try {
      const coupon = await CouponCode.findByIdAndDelete(req.params.id);

      if(!coupon){
        return next (new ErrorHandler("Coupon does not exist", 400))
      }

      res.status(200).json({
        success: true,
        message: "Coupon deleted successfully"
      })
  } catch (error) {
    return next (new ErrorHandler(error.message, 500))
  }
})

const getCouponValue = CatchAsyncErrors(async(req,res,next) => {
  try {
    const couponCode = await CouponCode.findOne({ name: req.params.name });

    res.status(200).json({
      success: true,
      couponCode
    })
  } catch (error) {
    return next (new ErrorHandler(error.message, 500))
  }
})

module.exports = {
  createCoupon, getCoupon, deleteCoupon, getCouponValue
}

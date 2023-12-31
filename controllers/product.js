const  CatchAsyncErrors  = require("../middleware/CatchAsyncErrors.js");
const Product = require("../models/Product.js");
const Shop = require("../models/Shop.js");
const ErrorHandler = require("../utils/ErrorHandler.js");
const Order = require("../models/Order.js");
const fs = require("fs");

 const createProduct = CatchAsyncErrors(async (req, res, next) => {
  try {
    const shopId = req.body.shopId;
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return next(new ErrorHandler("Shop Id is invalid!!", 401));
    } else {
      const files = req.files;
      console.log(req.file)
      const imageUrls = files.map((file) => `${file.filename}`);
      const productData = req.body;
      productData.images = imageUrls;
      productData.shop = shop;

      const product = await Product.create(productData);

      res.status(201).json({
        success: true,
        product,
      });
    }
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

// Get all products shop
 const getProducts = CatchAsyncErrors(async (req, res, next) => {
  try {
    const products = await Product.find({ shopId: req.params.id });

    res.status(201).json({
      success: true,
      products,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Delete a product
 const deleteProduct = CatchAsyncErrors(async (req, res, next) => {
  try {
    const productId = req.params.id;
    console.log(productId)

    const productData = await Product.findById(productId);
    productData?.images.forEach((imageUrl) => {
      const filename = imageUrl;
      const filepath = `uploads/${filename}`;

      fs.unlink(filepath, (err) => {
        if (err) {
          console.log(err);
        }
      });
    });

    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Get all products
 const getAllProducts = CatchAsyncErrors(async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Review for product
 const reviewProduct = CatchAsyncErrors(async (req, res, next) => {
  try {
    const { user, rating, comment, productId, orderId } = req.body;

    const product = await Product.findById(productId);

    const review = {
      user,
      rating,
      comment,
      productId,
    };

    const isReviewed = product.reviews.find(
      (rev) => rev.user._id === req.user._id
    );

    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user._id === req.user._id) {
          rev.rating = rating;
          rev.comment = comment;
          rev.user = user;
        }
      });
    } else {
      product.reviews.push(review);
    }

    let avg = 0;
    product.reviews.forEach((rev) => (avg += rev.rating));

    product.ratings = (avg / product.reviews.length).toFixed(2);

    await product.save({ validateBeforeSave: false });

    await Order.findByIdAndUpdate(
      orderId,
      { $set: { "cart.$[elem].isReviewed": true } },
      { arrayFilters: [{ "elem._id": productId }], new: true }
    );

    res.status(200).json({
      success: true,
      message: "Reviewed successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

module.exports = {
  createProduct, getAllProducts, getProducts, deleteProduct, reviewProduct
}

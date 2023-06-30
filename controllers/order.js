const  CatchAsyncErrors  = require("../middleware/CatchAsyncErrors.js");
const ErrorHandler = require("../utils/ErrorHandler.js");
const Order = require("../models/Order.js");
const Product = require("../models/Product.js");

 const createOrder = CatchAsyncErrors(async (req, res, next) => {
  try {
    const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;

    // Group cart items by shopId
    const shopItemsMap = new Map();

    // Creating order based on shopId
    for (const item of cart) {
      const shopId = item.shopId;
      if (!shopItemsMap.has(shopId)) {
        shopItemsMap.set(shopId, []);
      }

      shopItemsMap.get(shopId).push(item);
    }

    // Creating order for each item
    const orders = [];
    for (const [shopId, items] of shopItemsMap) {
      const order = await Order.create({
        cart: items,
        shippingAddress,
        user,
        totalPrice,
        paymentInfo,
      });
      orders.push(order);
    }

    res.status(201).json({
      success: true,
      orders,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Get all orders of user
 const getAllOrders = CatchAsyncErrors(async (req, res, next) => {
  try {
    const orders = await Order.find({ "user._id": req.params.userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Get all orders of seller
 const getAllSellerOrders = CatchAsyncErrors(async (req, res, next) => {
  try {
    const orders = await Order.find({
      "cart.shop._id": req.params.shopId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Update order status
 const updateOrderStatus = CatchAsyncErrors(async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorHandler("Order not found with this id", 404));
    }

    if (req.body.status === "Transferred to delivery partner") {
      order.cart.forEach(async (o) => {
        await updateOrder(o._id, o.qty);
      });
    }

    order.status = req.body.status;

    if (req.body.status === "Delivered") {
      order.deliveredAt = Date.now();
      order.paymentInfo.status = "Succeeded";
    }

    await order.save({ validateBeforeSave: false });

    async function updateOrder(id, qty) {
      const product = await Product.findById(id);
      product.stock -= qty;
      product.sold_out += qty;

      await product.save({ validateBeforeSave: false });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Refund the customer
 const RefundUser = CatchAsyncErrors(async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorHandler("Order not found with this id", 404));
    }

    order.status = req.body.status;

    if (req.body.status === "Delivered") {
      order.deliveredAt = Date.now();
      order.paymentInfo.status = "Succeeded";
    }

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      order,
      message: "Order refund request successfully"
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Accept the refund
 const RefundSuccess = CatchAsyncErrors(async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorHandler("Order not found with this id", 404));
    }
    
    order.status = req.body.status;
    
    await order.save()

    res.status(200).json({
      success: true,
      message: "Order refund Successfull!!"
    })
    
    if (req.body.status === "Refund Success") {
      order.cart.forEach(async (o) => {
        await updateOrder(o._id, o.qty);
      });
    }
    async function updateOrder(id, qty) {
      const product = await Product.findById(id);
      product.stock += qty;
      product.sold_out -= qty;

      await product.save({ validateBeforeSave: false });
    }
    
    
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

module.exports = {
  createOrder, getAllOrders, getAllSellerOrders, updateOrderStatus, RefundSuccess, RefundUser
}

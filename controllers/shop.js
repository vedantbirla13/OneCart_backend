const Shop = require("../models/Shop.js");
const ErrorHandler = require("../utils/ErrorHandler.js");
const path = require("path");
const fs = require("fs");
const sendMail = require("../utils/sendMail.js");
const  CatchAsyncErrors  = require("../middleware/CatchAsyncErrors.js");
const jwt = require("jsonwebtoken");
const sendShopToken = require("../utils/ShopToken.js");

// Create shop
 const createShop = async (req, res, next) => {
  try {
    const { name, email, password, address, phone, zipCode } = req.body;

    // Validation
    if (!name || !email || !password || !phone || !address || !zipCode) {
      return next(new ErrorHandler("All fields are required", 400));
    }

    if (password.length < 6) {
      return next(
        new ErrorHandler("Password should be greater than 6 characters")
      );
    }

    const sellerEmail = await Shop.findOne({ email });

    if (sellerEmail) {
      const filename = req.file?.filename;
      const filePath = `uploads/${filename}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Error deleting file" });
        }
      });

      return next(new ErrorHandler("User already exists", 400));
    }

    const filename = req.file?.filename;
    const filepath = path.join(filename);

    const seller = {
      name: name,
      email: email,
      password: password,
      avatar: filepath,
      address: address,
      phone: phone,
      zipCode: zipCode,
    };

    const activationToken = createActivatonToken(seller);
    console.log(activationToken)

    const activationUrl = `https://one-cart-frontend.vercel.app/seller/activation/${activationToken}`;

    try {
      await sendMail({
        email: seller.email,
        subject: "Activate your shop",
        message: `
                    <h2>Hello ${seller.email}</h2>
                    <p2>please click on the link to activate your shop: ${activationUrl}</p2>
                    <p>This link is valid for only 30 minutes</p>
                    <p>Regards...</p>
                    <p>Ecomm Team</p>
                    
                    `,
      });
      res.status(201).json({
        success: true,
        message: `Please check your email ${seller.email} to activate your shop`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

// activation token
const createActivatonToken = (seller) => {
  return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

// Activate user shop
 const activateShop = CatchAsyncErrors(async (req, res, next) => {
  try {
    const { activation_token } = req.body;
    const newShop = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);

    if (!newShop) {
      return next(new ErrorHandler("Invalid token", 400));
    }

    const { name, email, password, avatar, address, phone, zipCode } = newShop;

    let seller = await Shop.findOne({ email });

    if (seller) {
      return next(new ErrorHandler("Shop user already exists", 400));
    }

    seller = await Shop.create({
      name,
      email,
      password,
      avatar,
      address,
      phone,
      zipCode,
    });

    sendShopToken(seller, 200, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Login shop
 const loginShop = CatchAsyncErrors(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Please provide the all fields!", 400));
    }

    const seller = await Shop.findOne({ email }).select("+password");

    if (!seller) {
      return next(new ErrorHandler("Shop user doesn't exists!", 400));
    }

    const isPasswordValid = await seller.comparePassword(password);

    if (!isPasswordValid) {
      return next(new ErrorHandler("Incorrect username or password", 400));
    }

    sendShopToken(seller, 201, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Load Seller
const getSeller = CatchAsyncErrors(async (req, res, next) => {
  try {
    const seller = await Shop.findById(req.seller.id);

    if (!seller) {
      return next(new ErrorHandler("Seller doesn't exists", 400));
    }

    res.status(200).json({
      success: true,
      seller,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Logout from shop
 const logoutShop = CatchAsyncErrors(async (req, res, next) => {
  try {
    res.cookie("Shop_token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(201).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Get shop info
 const getShopInfo = CatchAsyncErrors(async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.params.id);

    res.status(201).json({
      success: true,
      shop,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Update shop Profile picture
 const updateShopAvatar = CatchAsyncErrors(async (req, res, next) => {
  try {
    const existShopUser = await Shop.findById(req.seller._id);
    const existAvatarPath = `uploads/${existShopUser.avatar}`;

    fs.unlinkSync(existAvatarPath);

    const fileUrl = path.join(req.file.filename);

    const shop = await Shop.findByIdAndUpdate(req.seller._id, {
      avatar: fileUrl,
    });

    res.status(200).json({
      success: true,
      shop,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Update Shop info
 const updateShopInfo = CatchAsyncErrors(async (req, res, next) => {
  try {
    const { name, description, address, phone, zipCode } = req.body;
    const shop = await Shop.findOne(req.seller._id);

    if (!shop) {
      return next(new ErrorHandler("Seller not found", 400));
    }

    shop.name = name;
    shop.description = description;
    shop.phone = phone;
    shop.address = address;
    shop.zipCode = zipCode;
    await shop.save();

    res.status(200).json({
      success: true,
      shop,
    });

  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

module.exports = {
  createShop, loginShop, getSeller, getShopInfo, loginShop, logoutShop, updateShopAvatar, updateShopInfo, activateShop
}

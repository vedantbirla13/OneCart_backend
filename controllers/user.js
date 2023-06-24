import User from "../models/User.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import sendMail from "../utils/sendmail.js";
import { CatchAsyncErrors } from "../middleware/CatchAsyncErrors.js";
import sendToken from "../utils/jwtToken.js";

// Create user
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return next(new ErrorHandler("All fields are required", 400));
    }

    if (password.length < 6) {
      return next(
        new ErrorHandler("Password should be greater than 6 characters")
      );
    }

    const userEmail = await User.findOne({ email });

    if (userEmail) {
      // If the user already exist then the image should not get uploaded by multer
      // so to prevent this we do the following
      const filename = req.file.filename;
      const filepath = `uploads/${filename}`;
      fs.unlink(filepath, (err) => {
        if (err) {
          res.status(500).json({ message: "Error deleting file" });
        }
      });

      return next(new ErrorHandler("User already exists", 400));
    }

    const filename = req.file.filename;
    const filepath = path.join(filename);
    const user = {
      name: name,
      email: email,
      password: password,
      avatar: filepath,
    };

    const activationToken = createActivatonToken(user);

    const activationUrl = `http://localhost:3000/activation/${activationToken}`;

    try {
      await sendMail({
        email: user.email,
        subject: "Activate your account",
        message: `
                    <h2>Hello ${user.email}</h2>
                    <p2>please click on the link to activate your account: ${activationUrl}</p2>
                    <p>This link is valid for only 30 minutes</p>
                    <p>Regards...</p>
                    <p>Ecomm Team</p>
                    
                    `,
      });
      res.status(201).json({
        success: true,
        message: `Please check your email ${user.email} to activate your account`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

// activation token
const createActivatonToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, { expiresIn: "5m" });
};

// Activate user
export const activateUser = CatchAsyncErrors(async (req, res, next) => {
  try {
    const { activation_token } = req.body;
    const newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);

    if (!newUser) {
      return next(new ErrorHandler("Invalid token", 400));
    }

    const { name, email, password, avatar } = newUser;

    let user = await User.findOne({ email });

    if (user) {
      return next(new ErrorHandler("User already exists", 400));
    }

    user = await User.create({
      name,
      email,
      password,
      avatar,
    });

    sendToken(user, 200, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Login user
export const loginUser = CatchAsyncErrors(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Please provide the all fields!", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("User doesn't exists!", 400));
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return next(new ErrorHandler("Incorrect username or password", 400));
    }

    sendToken(user, 201, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Load user
export const getUser = CatchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new ErrorHandler("User doesn't exists", 400));
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Logout user
export const logoutUser = CatchAsyncErrors(async (req, res, next) => {
  try {
    res.cookie("token", null, {
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

// Update user info
export const updateUser = CatchAsyncErrors(async (req, res, next) => {
  try {
    const { name, email, password, phoneNumber } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("User not found", 400));
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return next(new ErrorHandler("Wrong email or password!!", 400));
    }

    user.name = name;
    user.email = email;
    user.phoneNumber = phoneNumber;

    await user.save();

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Update avatar
export const updateAvatar = CatchAsyncErrors(async (req, res, next) => {
  try {
    const existUser = await User.findById(req.user.id);
    const existAvatarPath = `uploads/${existUser.avatar}`;

    fs.unlinkSync(existAvatarPath);

    const fileUrl = path.join(req.file.filename);

    const user = await User.findByIdAndUpdate(req.user.id, {
      avatar: fileUrl,
    });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Update user address
export const updateUserAddress = CatchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const sameAddress = user.addresses.find(
      (address) => address.addressType === req.body.addressType
    );

    if (sameAddress) {
      return next(
        new ErrorHandler(`${req.body.addressType} address already exists`)
      );
    }

    const existAddress = user.addresses.find(
      (address) => address._id === req.body._id
    );

    if (existAddress) {
      Object.assign(existAddress, req.body);
    } else {
      // Add new address to the array
      user.addresses.push(req.body);
    }

    await user.save();

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Delete user address
export const deleteUserAddress = CatchAsyncErrors(async (req, res, next) => {
  try {
    const userId = req.user._id;
    const addressId = req.params.id;

    // Here pull is used because addresses is an array
    // So to delete an specific element of array we have to use
    // mongodb function called pull
    await User.updateOne(
      {
        _id: userId,
      },
      { $pull: { addresses: { _id: addressId } } }
    );

    const user = await User.findById(userId);

    res.status(200).json({ success: true, user });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Change user password
export const changePassword = CatchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("+password");
    const isPasswordMatch = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatch) {
      return next(new ErrorHandler("Old password is incorrect!!", 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      return next(new ErrorHandler("Password does not match!!", 400));
    }

    user.password = req.body.newPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully!!",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

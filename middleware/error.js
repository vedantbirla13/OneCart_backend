const ErrorHandler = require("../utils/ErrorHandler.js");

const error = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server Error";

  // Wrong mongodb id error
  if (err.name === "CastError") {
    const message = `Resources not found with id.. Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Duplicate key Error
  if (err.code === 11000) {
    const message = `Duplicate key ${Object.keys(err.keyValue)} Entered `;
    err = new ErrorHandler(message, 400);
  }

  // // Wrong jwt Error
  // if ((err.name = "JsonWebTokenError")) {
  //   const message = `Your Url is invalid Please try again later`;
  //   err = new ErrorHandler(message, 400);
  // }

  // Jwt Expired
  if (err.name === "TokenExpiredError") {
    const message = `Your URL is expired Please try again later`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

module.exports = error

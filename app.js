const express =  require("express");
const ErrorHandler = require("./middleware/error.js");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
// Middlewares
app.use(
  cors({
    origin: ["http://localhost:3000", "https://one-cart-frontend.vercel.app"],
    credentials: true,
    methods: ["GET","POST","DELETE","PUT"]
  })
);
app.use(express.json());
app.use(express.urlencoded({
  extended:true
}));
app.use(cookieParser());
app.use("/", express.static(path.join(__dirname,"./uploads")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/test", (req, res) => {
  res.send("Hello world!");
});

// Config
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({
    path: "./config/config.env",
  });
}

// Import routes
const user = require("./routes/userRoute.js");
const shop = require("./routes/shopRoute.js");
const product = require("./routes/productRoute.js");
const event = require("./routes/eventRoute.js");
const coupon = require("./routes/couponRoute.js");
const payment = require("./routes/paymentRoute.js");
const order = require("./routes/orderRoute.js");


app.use("/api/v1/user", user);
app.use("/api/v1/shop", shop);
app.use("/api/v1/product", product);
app.use("/api/v1/event", event);
app.use("/api/v1/coupon", coupon);
app.use("/api/v1/payment", payment);
app.use("/api/v1/order", order);


// Error handler
app.use(ErrorHandler);

module.exports = app

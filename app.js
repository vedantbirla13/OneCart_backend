import express from "express";
import dotenv from "dotenv";
import ErrorHandler from "./middleware/error.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import { dirname} from 'path';
import path from "path";
import { fileURLToPath } from 'url';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
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
  dotenv.config({
    path: "./config/config.env",
  });
}

// Import routes
import user from "./routes/userRoute.js";
import shop from "./routes/shopRoute.js"
import product from "./routes/productRoute.js"
import event from "./routes/eventRoute.js"
import coupon from "./routes/couponRoute.js"
import payment from "./routes/paymentRoute.js"
import order from "./routes/orderRoute.js"


app.use("/api/v1/user", user);
app.use("/api/v1/shop", shop);
app.use("/api/v1/product", product);
app.use("/api/v1/event", event);
app.use("/api/v1/coupon", coupon);
app.use("/api/v1/payment", payment);
app.use("/api/v1/order", order);


// Error handler
app.use(ErrorHandler);

export default app;

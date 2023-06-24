import app from "./app.js"
import dotenv from "dotenv";
import connectDB from "./config/database.js";

// Handling uncaught exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server for handling uncaught exception`);
});

// Config
if (process.env.NODE_ENV !== "production") {
  dotenv.config({
    path: "./config/config.env",
  });
}

// Connect db
connectDB()

// Create server
const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server is running on http://localhost:${process.env.PORT}`
  );
});

// Unhandled promise rejection error
process.on("unhandledRejection", (err) => {
  console.log(`Shutting down the server for ${err.message}`);
  console.log(`Shutting down the server for unhandled promise rejection`);

  server.close(() => {
    process.exit(1);
  });
});

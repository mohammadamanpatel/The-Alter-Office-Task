import express from "express";
import { config } from "dotenv";
import DBConnection from "./config/DB.config.js"; // MongoDB connection
import cookieParser from "cookie-parser"; // Cookie parsing middleware
import authRoutes from "./routes/auth.routes.js"; // Auth routes
import urlRoutes from "./routes/url.routes.js"; // URL routes

config(); // Load environment variables
const app = express();

// Passport configuration (ensure you've set up Passport strategies in './config/Passport.config.js')

// Middleware
app.use(cookieParser()); // To parse cookies
app.use(express.json()); // To parse incoming JSON requests

// Passport initialization

// Authentication Routes
app.use("/auth", authRoutes); // Use auth routes from auth.routes.js

// Apply the verifyUser middleware to the /url route at a global level
app.use("/auth/url", urlRoutes); // Protect /url routes with verifyUser middleware

// Server start
app.listen(process.env.PORT, async () => {
  await DBConnection(); // Connect to MongoDB
  console.log(`Our app is running on port ${process.env.PORT}`);
});

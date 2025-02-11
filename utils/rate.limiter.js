<<<<<<< HEAD
import rateLimit from "express-rate-limit";

// Rate limiter for general API routes
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again after 15 minutes.",
});

// Rate limiter for sensitive routes (e.g., URL creation, analytics)
export const sensitiveLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // Limit each IP to 50 requests per windowMs
  message: "Too many requests, please try again after 1 hour.",
});

// Rate limiter for public routes (e.g., URL redirection)
export const publicLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 500, // Limit each IP to 500 requests per windowMs
  message: "Too many requests, please try again after 1 hour.",
});
=======
import { RateLimiterRedis } from "rate-limiter-flexible";
import redisclient from "../config/Redis.config.js";

const rateLimiter = new RateLimiterRedis({
  storeClient: redisclient,
  keyPrefix: "rateLimiter",
  points: 100,            // Number of requests allowed per 15 minutes
  duration: 15 * 60,      // 15 minutes
  blockDuration: 15 * 60, // Block for 15 minutes if limit exceeded
});

const rateLimiterMiddleware = async (req, res, next) => {
  const userId = req.user?.id || req.ip; // Use user ID if authenticated, else fallback to IP
  console.log("userId", userId);
  try {
    await rateLimiter.consume(userId); // Consume 1 point for this user
    // console.log("Rate limit OK",rateLimiter);
    next();
  } catch (err) {
    res.status(429).json({
      message: "Too many requests. Please try again later.",
    });
  }
};

export default rateLimiterMiddleware;
>>>>>>> 34d4895 (completed betterment)

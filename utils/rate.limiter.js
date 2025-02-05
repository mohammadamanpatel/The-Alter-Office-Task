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
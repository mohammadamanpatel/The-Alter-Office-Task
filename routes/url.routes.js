import express from "express";
import {
  createShortUrl,
  deleteShortUrl,
<<<<<<< HEAD
  getOverallAnalytics,
  getTopicAnalytics,
  getUrlAnalytics,
=======
>>>>>>> 34d4895 (completed betterment)
  getUserUrls,
  redirectToOriginalUrl,
} from "../controllers/url.controller.js";
import verifyUser from "../middlewares/verifyUser.js";
<<<<<<< HEAD
import { apiLimiter, publicLimiter, sensitiveLimiter } from "../utils/rate.limiter.js";

const router = express.Router();

// **URL Shortening Routes**
router.post("/shorten", verifyUser, sensitiveLimiter, createShortUrl); // Apply sensitiveLimiter

// **User URL Routes**
router.get("/", verifyUser, apiLimiter, getUserUrls); // Apply apiLimiter
router.delete("/delete/:alias", verifyUser, sensitiveLimiter, deleteShortUrl); // Apply sensitiveLimiter

// **Analytics Routes**
router.get("/analytics/:alias", verifyUser, apiLimiter, getUrlAnalytics); // Apply apiLimiter
router.get("/analytics/topic/:topic", apiLimiter, getTopicAnalytics); // Apply apiLimiter
router.get("/overallAnalytics", verifyUser, apiLimiter, getOverallAnalytics); // Apply apiLimiter

// **Public Route (No Authentication Required)**
router.get("/:alias", publicLimiter, redirectToOriginalUrl); // Apply publicLimiter

=======
import rateLimiterMiddleware from "../utils/rate.limiter.js";
import { getOverallAnalytics, getTopicAnalytics, getUrlAnalytics } from "../controllers/analytics.controllers.js";
const router = express.Router();
// **URL Shortening Routes**
router.post("/shorten", verifyUser, rateLimiterMiddleware, createShortUrl); 
// **User URL Routes**
router.get("/", verifyUser, rateLimiterMiddleware, getUserUrls); 
router.delete("/delete/:alias", verifyUser, rateLimiterMiddleware, deleteShortUrl); 
// **Analytics Routes**
router.get("/analytics/:alias", verifyUser, rateLimiterMiddleware, getUrlAnalytics);
router.get("/analytics/topic/:topic", rateLimiterMiddleware, getTopicAnalytics); 
router.get("/overallAnalytics", verifyUser, rateLimiterMiddleware, getOverallAnalytics); 
// **Public Route (No Authentication Required)**
router.get("/:alias", rateLimiterMiddleware, redirectToOriginalUrl);
>>>>>>> 34d4895 (completed betterment)
export default router;
import express from "express";
import {
  createShortUrl,
  deleteShortUrl,
  getOverallAnalytics,
  getTopicAnalytics,
  getUrlAnalytics,
  getUserUrls,
  redirectToOriginalUrl,
} from "../controllers/url.controller.js";
import verifyUser from "../middlewares/verifyUser.js";
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

export default router;
import Analytics from "../models/Analytics.model.js";
import Url from "../models/Url.model.js";
import redisclient from "../config/Redis.config.js";
import { handleError } from "../services/Error.service.js";
import { checkCache, setCache } from "../services/Redis.cache.js";

// Get URL Analytics
export const getUrlAnalytics = async (req, res) => {
  try {
    console.log("req.params in url analytics", req.params);
    const { alias } = req.params;

    // Check Redis cache
    const cachedData = await checkCache(`urlAnalytics:${alias}`, redisclient);
    console.log("cachedData", cachedData);
    if (cachedData) {
      console.log("Serving from cache");
      return res.status(200).json(cachedData);
    }

    const url = await Url.findOne({ alias });
    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    const clicks = await Analytics.find({ url: url._id });
    const totalClicks = clicks.length;
    const uniqueUsers = new Set(clicks.map((click) => click.ipAddress)).size;

    // Calculate clicks by date for the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split("T")[0];
    });

    const clicksByDate = last7Days.map((day) => ({
      date: day,
      clickCount: clicks.filter(
        (click) => click.timestamp.toISOString().split("T")[0] === day
      ).length,
    }));

    const osType = clicks.reduce((acc, click) => {
      acc[click.osType] = (acc[click.osType] || 0) + 1;
      return acc;
    }, {});

    const deviceType = clicks.reduce((acc, click) => {
      acc[click.deviceType] = (acc[click.deviceType] || 0) + 1;
      return acc;
    }, {});

    const analyticsData = {
      totalClicks,
      uniqueUsers,
      clicksByDate,
      osType,
      deviceType,
    };

    // Cache in Redis for 1 hour
    await setCache(`urlAnalytics:${alias}`, analyticsData, redisclient);

    console.log("Serving from database");
    return res.status(200).json(analyticsData);
  } catch (error) {
    console.error("Error fetching URL analytics:", error);
    handleError(res, error, "Error fetching URL analytics");
  }
};

// Get Topic Analytics
export const getTopicAnalytics = async (req, res) => {
  try {
    const { topic } = req.params;

    const cachedData = await checkCache(`topicAnalytics:${topic}`, redisclient);
    if (cachedData) {
      console.log("Serving from cache");
      return res.status(200).json(cachedData);
    }

    const urls = await Url.find({ topic });
    if (!urls.length) {
      return res.status(404).json({ error: "No URLs found for this topic" });
    }

    const urlIds = urls.map((url) => url._id);
    const clicks = await Analytics.find({ url: { $in: urlIds } });

    const totalClicks = clicks.length;
    const uniqueUsers = new Set(clicks.map((click) => click.ipAddress)).size;

    const topicAnalytics = {
      totalClicks,
      uniqueUsers,
      urls: urls.map((url) => ({
        shortUrl: url.shortUrl,
        totalClicks: clicks.filter(
          (click) => click.url.toString() === url._id.toString()
        ).length,
        uniqueUsers: new Set(
          clicks
            .filter((click) => click.url.toString() === url._id.toString())
            .map((click) => click.ipAddress)
        ).size,
      })),
    };

    // Cache in Redis for 1 hour
    await setCache(`topicAnalytics:${topic}`, topicAnalytics, redisclient);

    return res.status(200).json(topicAnalytics);
  } catch (error) {
    console.error("Error fetching topic analytics:", error);
    handleError(res, error, "Error fetching topic analytics");
  }
};

// Get Overall Analytics
export const getOverallAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    const cachedData = await checkCache(
      `overallAnalytics:${userId}`,
      redisclient
    );
    if (cachedData) {
      console.log("Serving from cache");
      return res.status(200).json(cachedData);
    }

    const urls = await Url.find({ user: userId });
    if (!urls.length) {
      return res.status(404).json({ error: "No URLs found for this user" });
    }

    const urlIds = urls.map((url) => url._id);
    const clicks = await Analytics.find({ url: { $in: urlIds } });

    const totalClicks = clicks.length;
    const uniqueUsers = new Set(clicks.map((click) => click.ipAddress)).size;

    const osType = clicks.reduce((acc, click) => {
      acc[click.osType] = (acc[click.osType] || 0) + 1;
      return acc;
    }, {});

    const deviceType = clicks.reduce((acc, click) => {
      acc[click.deviceType] = (acc[click.deviceType] || 0) + 1;
      return acc;
    }, {});

    const overallAnalytics = {
      totalUrls: urls.length,
      totalClicks,
      uniqueUsers,
      osType,
      deviceType,
    };

    // Cache in Redis for 1 hour
    await setCache(`overallAnalytics:${userId}`, overallAnalytics, redisclient);

    console.log("Serving from database");
    return res.status(200).json(overallAnalytics);
  } catch (error) {
    console.error("Error fetching overall analytics:", error);
    handleError(res, error, "Error fetching overall analytics");
  }
};

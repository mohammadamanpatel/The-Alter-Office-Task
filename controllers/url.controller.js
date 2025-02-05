import { nanoid } from "nanoid";
import Url from "../models/Url.model.js";
import useragent from "useragent"; // Library to parse user-agent string
import requestIp from "request-ip"; // Library to get user's IP address
import redisClient from "../config/Redis.config.js";
export const createShortUrl = async (req, res) => {
  try {
    console.log("req.body", req.body);
    const { longUrl, customAlias, topic } = req.body;
    const userId = req.user.id;

    if (!longUrl) {
      return res.status(400).json({ error: "Long URL is required" });
    }

    let alias = customAlias || nanoid(6);
    const existingAlias = await Url.findOne({ alias });
    if (existingAlias) {
      return res.status(400).json({ error: "Alias already in use" });
    }

    let shortUrl = `${process.env.BASE_URL}/${alias}`;
    const newUrl = new Url({ longUrl, shortUrl, alias, topic, user: userId });
    console.log("newUrl", newUrl);
    await newUrl.save();

    await redisClient.del(`overallAnalytics:${userId}`); // Overall analytics
    await redisClient.del(`urlAnalytics:${alias}`); // URL analytics
    await redisClient.del(`topicAnalytics:${topic}`); // Topic analytics

    return res
      .status(201)
      .json({ longUrl, shortUrl, alias, topic, user: userId });
  } catch (error) {
    console.error("Error while creating shortUrl", error);
    res.status(500).json({ error: "Internal Server error" });
  }
};

export const redirectToOriginalUrl = async (req, res) => {
  try {
    console.log("req.params", req.params);
    const { alias } = req.params;
    const urlData = await Url.findOne({ alias });

    if (!urlData) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    // Get user's IP address
    const ipAddress = requestIp.getClientIp(req);
    console.log("ipAddress", ipAddress);
    // Parse user-agent string to get OS and device type
    const userAgent = useragent.parse(req.headers["user-agent"]);
    console.log("userAgent", userAgent);
    const osType = userAgent.os.toString(); // e.g., "Windows 10", "Mac OS X"
    console.log("osType", osType);
    const deviceType = userAgent.device.toString(); // e.g., "iPhone", "Desktop"
    console.log("deviceType", deviceType);
    // Add click data to the URL
    urlData.clicks.push({
      ipAddress,
      osType,
      deviceType,
    });

    // Increment visit count
    urlData.visits = (urlData.visits || 0) + 1;
    console.log("urlData", urlData);
    // Save the updated URL document
    await urlData.save();

    // Redirect to the original URL
    return res.json(urlData);
  } catch (error) {
    console.error("Error in redirecting", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getUserUrls = async (req, res) => {
  try {
    console.log("req.user", req.user);
    const userId = req.user.id;
    const urls = await Url.find({ user: userId });

    return res.status(200).json(urls);
  } catch (error) {
    console.error("Error fetching URLs", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const deleteShortUrl = async (req, res) => {
  try {
    const { alias } = req.params;
    const userId = req.user.id;

    const url = await Url.findOne({ alias });

    if (!url) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    // Check if the user owns the URL
    if (url.user.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await Url.findOneAndDelete({ alias });
    return res.status(200).json({ message: "Short URL deleted successfully" });
  } catch (error) {
    console.error("Error deleting URL", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUrlAnalytics = async (req, res) => {
  try {
    console.log("req.params", req.params);
    const { alias } = req.params;

    // Check if data is cached in Redis
    const cachedData = await redisClient.get(`urlAnalytics:${alias}`);
    if (cachedData) {
      console.log("Serving from cache");
      return res.status(200).json(JSON.parse(cachedData));
    }

    // Fetch data from the database
    const url = await Url.find({ alias: alias });
    console.log("url", url);
    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }
    const clicks = [];
    url.map((urlelem) => {
      console.log("urlelem", urlelem);
      clicks.push(...urlelem.clicks);
    });
    console.log("clicks", clicks);
    // Calculate analytics
    const totalClicks = clicks.length;
    const uniqueUsers = [...new Set(clicks.map((click) => click.ipAddress))]
      .length;

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
      osType: Object.entries(osType).map(([osName, uniqueClicks]) => ({
        osName,
        uniqueClicks,
        uniqueUsers: uniqueClicks,
      })),
      deviceType: Object.entries(deviceType).map(
        ([deviceName, uniqueClicks]) => ({
          deviceName,
          uniqueClicks,
          uniqueUsers: uniqueClicks,
        })
      ),
    };

    // Cache the data in Redis (expire after 1 hour)
    await redisClient.set(
      `urlAnalytics:${alias}`,
      JSON.stringify(analyticsData),
      {
        EX: 3600, // Cache expiration time in seconds (1 hour)
      }
    );
    console.log("analyticsData", analyticsData);
    console.log("Serving from database");
    return res.status(200).json(analyticsData);
  } catch (error) {
    console.error("Error fetching URL analytics:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getTopicAnalytics = async (req, res) => {
  try {
    const { topic } = req.params;

    // Check if data is cached in Redis
    const cachedData = await redisClient.get(`topicAnalytics:${topic}`);
    if (cachedData) {
      console.log("Serving from cache");
      return res.status(200).json(JSON.parse(cachedData));
    }

    // Fetch data from the database
    const urls = await Url.find({ topic });
    if (!urls.length) {
      return res.status(404).json({ error: "No URLs found for this topic" });
    }

    // Calculate analytics
    let totalClicks = 0;
    let uniqueUsers = new Set();
    const clicksByDate = {};

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split("T")[0];
    });

    urls.forEach((url) => {
      totalClicks += url.clicks.length;
      url.clicks.forEach((click) => {
        uniqueUsers.add(click.ipAddress);

        const clickDate = click.timestamp.toISOString().split("T")[0];
        if (last7Days.includes(clickDate)) {
          clicksByDate[clickDate] = (clicksByDate[clickDate] || 0) + 1;
        }
      });
    });

    const topicAnalytics = {
      totalClicks,
      uniqueUsers: uniqueUsers.size,
      clicksByDate: last7Days.map((date) => ({
        date,
        clickCount: clicksByDate[date] || 0,
      })),
      urls: urls.map((url) => ({
        shortUrl: url.shortUrl,
        totalClicks: url.clicks.length,
        uniqueUsers: new Set(url.clicks.map((click) => click.ipAddress)).size,
      })),
    };

    // Cache the data in Redis (expire after 1 hour)
    await redisClient.set(
      `topicAnalytics:${topic}`,
      JSON.stringify(topicAnalytics),
      {
        EX: 3600, // Cache expiration time in seconds (1 hour)
      }
    );

    console.log("Serving from database");
    return res.status(200).json(topicAnalytics);
  } catch (error) {
    console.error("Error fetching topic analytics:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getOverallAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if data is cached in Redis
    const cachedData = await redisClient.get(`overallAnalytics:${userId}`);
    if (cachedData) {
      console.log("Serving from cache");
      return res.status(200).json(JSON.parse(cachedData));
    }

    // Fetch data from the database
    const urls = await Url.find({ user: userId });
    if (!urls.length) {
      return res.status(404).json({ error: "No URLs found for this user" });
    }

    // Calculate analytics
    let totalClicks = 0;
    let uniqueUsers = new Set();
    const osType = {};
    const deviceType = {};

    urls.forEach((url) => {
      totalClicks += url.clicks.length;
      url.clicks.forEach((click) => {
        uniqueUsers.add(click.ipAddress);

        osType[click.osType] = (osType[click.osType] || 0) + 1;
        deviceType[click.deviceType] = (deviceType[click.deviceType] || 0) + 1;
      });
    });

    const overallAnalytics = {
      totalUrls: urls.length,
      totalClicks,
      uniqueUsers: uniqueUsers.size,
      osType: Object.keys(osType).map((os) => ({
        osName: os,
        uniqueClicks: osType[os],
        uniqueUsers: osType[os],
      })),
      deviceType: Object.keys(deviceType).map((device) => ({
        deviceName: device,
        uniqueClicks: deviceType[device],
        uniqueUsers: deviceType[device],
      })),
    };

    // Cache the data in Redis (expire after 1 hour)
    await redisClient.set(
      `overallAnalytics:${userId}`,
      JSON.stringify(overallAnalytics),
      {
        EX: 3600, // Cache expiration time in seconds (1 hour)
      }
    );

    console.log("Serving from database");
    return res.status(200).json(overallAnalytics);
  } catch (error) {
    console.error("Error fetching overall analytics:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

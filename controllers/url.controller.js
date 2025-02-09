import { nanoid } from "nanoid";
import Url from "../models/Url.model.js";
import useragent from "useragent";
import requestIp from "request-ip";
import redisclient from "../config/Redis.config.js";
//note that if you are using redis insight of local system so plz use redisclient.set instead of redisclient.setex(only for redis upstash)
// Create Short URL
export const createShortUrl = async (req, res) => {
  try {
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

    const shortUrl = `${process.env.BASE_URL}/${alias}`;
    const newUrl = new Url({ longUrl, shortUrl, alias, topic, user: userId });
    await newUrl.save();

    // Clear related cache
    await redisclient.del(`overallAnalytics:${userId}`);
    await redisclient.del(`urlAnalytics:${alias}`);
    await redisclient.del(`topicAnalytics:${topic}`);

    return res.status(201).json({ longUrl, shortUrl, alias, topic, user: userId });
  } catch (error) {
    console.error("Error while creating shortUrl:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Redirect to Original URL
export const redirectToOriginalUrl = async (req, res) => {
  try {
    console.log("req.params", req.params);
    const { alias } = req.params;
    const urlData = await Url.findOne({ alias });

    if (!urlData) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    const ipAddress = requestIp.getClientIp(req);
    const userAgent = useragent.parse(req.headers["user-agent"]);
    const osType = userAgent.os.toString();
    const deviceType = userAgent.device.toString();

    urlData.clicks.push({ ipAddress, osType, deviceType });
    urlData.visits = (urlData.visits || 0) + 1;
    console.log("urlData", urlData);
    await urlData.save();

    return res.json(urlData);
  } catch (error) {
    console.error("Error in redirecting:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get User URLs
export const getUserUrls = async (req, res) => {
  try {
    const userId = req.user.id;
    const urls = await Url.find({ user: userId });

    return res.status(200).json(urls);
  } catch (error) {
    console.error("Error fetching URLs:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete Short URL
export const deleteShortUrl = async (req, res) => {
  try {
    const { alias } = req.params;
    const userId = req.user.id;

    const url = await Url.findOne({ alias });
    if (!url) {
      return res.status(404).json({ error: "Short URL not found" });
    }
    if (url.user.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await Url.findOneAndDelete({ alias });
    await redisclient.del(`urlAnalytics:${alias}`);
    await redisclient.del(`overallAnalytics:${userId}`);

    return res.status(200).json({ message: "Short URL deleted successfully" });
  } catch (error) {
    console.error("Error deleting URL:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get URL Analytics
export const getUrlAnalytics = async (req, res) => {
  try {
    console.log("req.params", req.params);
    const { alias } = req.params;

    // Check if data is cached in Redis
    const cachedData = await redisclient.get(`urlAnalytics:${alias}`);
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
    await redisclient.setex(
      `urlAnalytics:${alias}`,
      3600, JSON.stringify(analyticsData)
    );
    console.log("analyticsData", analyticsData);
    console.log("Serving from database");
    return res.status(200).json(analyticsData);
  } catch (error) {
    console.error("Error fetching URL analytics:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


// Get Topic Analytics
export const getTopicAnalytics = async (req, res) => {
  try {
    const { topic } = req.params;

    const cachedData = await redisclient.get(`topicAnalytics:${topic}`);
    if (cachedData) {
      console.log("Serving from cache");
      return res.status(200).json(JSON.parse(cachedData));
    }

    const urls = await Url.find({ topic });
    if (!urls.length) {
      return res.status(404).json({ error: "No URLs found for this topic" });
    }

    const totalClicks = urls.reduce((sum, url) => sum + url.clicks.length, 0);
    const uniqueUsers = new Set(urls.flatMap((url) => url.clicks.map((click) => click.ipAddress)));

    const topicAnalytics = {
      totalClicks,
      uniqueUsers: uniqueUsers.size,
      urls: urls.map((url) => ({
        shortUrl: url.shortUrl,
        totalClicks: url.clicks.length,
        uniqueUsers: new Set(url.clicks.map((click) => click.ipAddress)).size,
      })),
    };

    // Cache the topic analytics for 1 hour using setex
    await redisclient.setex(`topicAnalytics:${topic}`, 3600, JSON.stringify(topicAnalytics));

    return res.status(200).json(topicAnalytics);
  } catch (error) {
    console.error("Error fetching topic analytics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



export const getOverallAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const cachedData = await redisclient.get(`overallAnalytics:${userId}`);
    if (cachedData) {
      console.log("Serving from cache");
      return res.status(200).json(JSON.parse(cachedData));
    }

    const urls = await Url.find({ user: userId });
    if (!urls.length) {
      return res.status(404).json({ error: "No URLs found for this user" });
    }

    let totalClicks = 0;
    let uniqueUsers = new Set();
    const osType = {};
    const deviceType = {};
    console.log("urls", urls);  
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
      osType,
      deviceType,
    };

    // Cache the overall analytics for 1 hour using setex
    await redisclient.setex(`overallAnalytics:${userId}`, 3600, JSON.stringify(overallAnalytics));

    console.log("Serving from database");
    return res.status(200).json(overallAnalytics);
  } catch (error) {
    console.error("Error fetching overall analytics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

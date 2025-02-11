import { nanoid } from "nanoid";
import Url from "../models/Url.model.js";
import useragent from "useragent";
import requestIp from "request-ip";
import redisclient from "../config/Redis.config.js";
import Analytics from "../models/Analytics.model.js";
import { handleError } from "../services/Error.service.js";

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
    handleError(res, error, "Error while creating shortUrl");
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

    // Create a new Analytics record for the click
    const analytics = new Analytics({
      url: urlData._id,
      ipAddress,
      osType,
      deviceType,
    });
    await analytics.save();

    // Update the clicks array in the Url document
    urlData.visits = (urlData.visits || 0) + 1;
    await urlData.save();

    return res.json(urlData);
  } catch (error) {
    console.error("Error in redirecting:", error);
    handleError(res, error, "Error in redirecting");
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
    handleError(res, error, "Error fetching URLs");
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

    handleError(res, null, "Short URL deleted successfully");
  } catch (error) {
    console.error("Error deleting URL:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

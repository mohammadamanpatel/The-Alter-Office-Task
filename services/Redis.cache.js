export const checkCache = async (cacheKey, redisClient) => {
  try {
    const cachedData = await redisClient.get(cacheKey);
    return cachedData ? JSON.parse(cachedData) : null;
  } catch (error) {
    res.json({ errormessage: "Error checking cache", error: error });
  }
};

export const setCache = async (
  cacheKey,
  data,
  redisClient,
  expirationTime = 3600
) => {
  try {
    await redisClient.setex(cacheKey, expirationTime, JSON.stringify(data));
  } catch (error) {
    res.json({ errormessage: "Error setting cache", error: error });
  }
};

const redis = require("redis");
const { routesToCache } = require("./redis-constants");
const { encrypt, decrypt } = require("../../utils/key-decryption");

const redisClient = redis.createClient({
  username: decrypt(process.env.REDIS_USERNAME),
  password: decrypt(process.env.REDIS_PASSWORD),
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

const connectRedis = () => redisClient.connect();

// Middleware to handle caching with Redis for specific routes
const redisMiddleware = async (req, res, next) => {
  let shouldCacheValue = false;
  let cacheKey = null;
  let routeConfig = null;

  // Check if the current route should be cached
  if (
    req.path &&
    routesToCache &&
    routesToCache.length &&
    routesToCache.findIndex(({ route }) => route === req.path) > -1
  ) {
    // Get the route configuration for caching
    routeConfig = routesToCache.find(({ route }) => route === req.path);

    // Generate cache key using route-specific function
    if (
      routeConfig &&
      routeConfig.getKey &&
      typeof routeConfig.getKey === "function"
    ) {
      cacheKey = routeConfig.getKey(req);

      // Check if the cache key exists in Redis
      const doesKeyExist = await redisClient.exists(cacheKey);

      if (doesKeyExist) {
        // If cache exists, retrieve cached data using the specified function
        const cacheGetFunction = routeConfig.cacheGetFunction || "get";
        const cachedData = await redisClient[cacheGetFunction](
          cacheKey,
          ...(routeConfig.cacheGetFunctionParams || [])
        );
        if (cachedData) {
          // Cache hit: send cached response
          console.log(`Cache hit for key: ${cacheKey}`);
          return res.status(200).send(cachedData);
        } else {
          // Cache miss: mark to cache the response
          shouldCacheValue = true;
          console.log(`Cache miss for key: ${cacheKey}`);
        }
      } else {
        // Cache miss: mark to cache the response
        shouldCacheValue = true;
        console.log(`Cache miss for key: ${cacheKey}`);
      }
    }
  }
  // If we reach here, it means we need to cache the response
  // Override res.send to cache the response before sending it

  // If response should be cached, override res.send to cache before sending
  if (shouldCacheValue && cacheKey) {
    const originalSend = res.send.bind(res);
    res.send = async (body) => {
      if (body) {
        // Set the response in Redis using the specified function
        const cacheSetFunction = routeConfig.cacheSetFunction || "set";
        try {
          // Use Redis transaction to set value and expiry atomically
          const transaction = redisClient.multi();
          transaction[cacheSetFunction](cacheKey, body);
          transaction.expire(
            cacheKey,
            parseInt(process.env.REDIS_DEFAULT_EXPIRY) || 600
          );
          const res = await transaction.exec();
          console.log(`Response cached with key: ${cacheKey}`);
        } catch (error) {
          // Log any error during caching
          console.error("Error caching response:", error);
        }
      }
      // Send the original response
      return originalSend(body);
    };
  }
  // Proceed to next middleware or route handler
  next();
};

module.exports = { redisClient, connectRedis, redisMiddleware };

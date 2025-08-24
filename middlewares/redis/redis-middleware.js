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

const redisMiddleware = async (req, res, next) => {
  let shouldCacheValue = false;
  let cacheKey = null;
  let routeConfig = null;
  if (
    req.path &&
    routesToCache &&
    routesToCache.length &&
    routesToCache.findIndex(({ route }) => route === req.path) > -1
  ) {
    routeConfig = routesToCache.find(({ route }) => route === req.path);
    if (
      routeConfig &&
      routeConfig.getKey &&
      typeof routeConfig.getKey === "function"
    ) {
      cacheKey = routeConfig.getKey(req);
      const doesKeyExist = await redisClient.exists(cacheKey);

      if (doesKeyExist) {
        const cacheGetFunction = routeConfig.cacheGetFunction || "get";
        const cachedData = await redisClient[cacheGetFunction](
          cacheKey,
          ...(routeConfig.cacheGetFunctionParams || [])
        );
        if (cachedData) {
          console.log(`Cache hit for key: ${cacheKey}`);
          return res.status(200).send(cachedData);
        } else {
          shouldCacheValue = true;
          console.log(`Cache miss for key: ${cacheKey}`);
        }
      } else {
        shouldCacheValue = true;
        console.log(`Cache miss for key: ${cacheKey}`);
      }
    }
  }
  // If we reach here, it means we need to cache the response
  // Override res.send to cache the response before sending it

  if (shouldCacheValue && cacheKey) {
    const originalSend = res.send.bind(res);
    res.send = async (body) => {
      if (body) {
        const cacheSetFunction = routeConfig.cacheSetFunction || "set";
        try {
          const transaction = redisClient.multi();
          transaction[cacheSetFunction](cacheKey, body);
          transaction.expire(
            cacheKey,
            parseInt(process.env.REDIS_DEFAULT_EXPIRY) || 600
          );
          const res = await transaction.exec();
          console.log(`Response cached with key: ${cacheKey}`);
        } catch (error) {
          console.error("Error caching response:", error);
        }
      }
      return originalSend(body);
    };
  }
  next();
};

module.exports = { redisClient, connectRedis, redisMiddleware };

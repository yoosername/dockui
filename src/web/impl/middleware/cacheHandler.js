const NodeCache = require("node-cache");
const cache = new NodeCache({
  stdTTL: 100,
  checkperiod: 120,
  errorOnMissing: false,
  useClones: true,
  deleteOnExpire: true
});

const fetchCachedResponseOrNull = key => {
  const cachedResponse = cache.get(key);
  if (cachedResponse !== undefined) {
    return cachedResponse;
  }
  return null;
};

const cacheResponse = (key, obj, ttl) => {
  return cache.set(key, obj, ttl);
};

const generateCacheKeyFromCtx = ctx => {
  return "cache_" + (ctx.request.originalPath || ctx.request.path);
};

const timeInMS = () => {
  let time = process.hrtime();
  time = time[0] * 1000 + time[1] / 1000000;
  return Math.round(time);
};

/**
 * @description Middleware function to cache requests
 */
module.exports = function({ config, logger } = {}) {
  return async function cache(ctx, next) {
    ctx.dockui.cache = {};
    // Mark the request time (ctx.dockui.cache.startTime)
    ctx.dockui.cache.startTime = timeInMS();
    // Build Key from path and add to ctx.dockui.cache.key
    ctx.dockui.cache.key = generateCacheKeyFromCtx(ctx);
    logger.debug("Looking in Cache (key=%s)", ctx.dockui.cache.key);
    // See if we have it cached
    const cachedResponse = fetchCachedResponseOrNull(ctx.dockui.cache.key);
    // If so respond with cached Response & mark response time (ctx.dockui.cache.responseTimestamp)
    if (cachedResponse) {
      ctx.dockui.cache.finishTime = timeInMS();
      const timeTaken =
        ctx.dockui.cache.finishTime - ctx.dockui.cache.startTime;
      logger.debug("Cached response took %s ms", timeTaken);
      return (ctx.body = cachedResponse);
    }
    // Continue up the middleware chain
    await next();
    // Request is ready
    // If Module has caching enabled cache using defined TTL
    const cacheSettings = ctx.dockui.module.getCache();
    if (cacheSettings && cacheSettings.enabled === true) {
      // Add current CTX.body to cache using (ctx.dockui.cache.key) mark response time (ctx.dockui.cache.responseTimestamp)
      const ttl = cacheSettings.ttl;
      if (ttl) {
        // If TTL use it
        cacheResponse(ctx.dockui.cache.key, ctx.body, ttl);
      } else {
        // Otherwise use the default
        cacheResponse(ctx.dockui.cache.key, ctx.body);
      }
      logger.debug("Cached response (key=%s)", ctx.dockui.cache.key);
    } else {
      logger.debug(
        "Caching disabled or not configured for module (key=%s)",
        ctx.dockui.module.getKey()
      );
    }
    ctx.dockui.cache.finishTime = timeInMS();
    const timeTaken = ctx.dockui.cache.finishTime - ctx.dockui.cache.startTime;
    logger.debug("Uncached response took %i ms", timeTaken);
    console.log(
      ctx.dockui.cache.startTime,
      ctx.dockui.cache.finishTime,
      timeTaken
    );
  };
};

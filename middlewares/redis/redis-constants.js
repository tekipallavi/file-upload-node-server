const { REDIS_DEFAULT_EXPIRY } = process.env;
const hash = require("object-hash");

const routesToCache = [
  {
    route: "/user-pagination",
    expireIn: REDIS_DEFAULT_EXPIRY,
    cacheValueType: "string",
    // example for list
    /* cacheSetFunction: "lPush",
    cacheGetFunction: "lRange",
    cacheGetFunctionParams: [0, -1], */
    cacheSetFunction: "set",
    cacheGetFunction: "get",
    // Function to generate a unique cache key based on request parameters
    getKey: (req) => {
      const hashObj = {
        page: req.query.page,
        limit: req.query.limit,
        search: req.query.search || null,
      };
      return `user-pagination-${hash(hashObj)}`;
    },
  },
];

module.exports = { routesToCache };

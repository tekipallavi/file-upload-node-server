module.exports = {
  apps: [
    {
      name: "server",
      script: "index.js",
      //node_args: "--inspect=9229",
      watch: true,
      env_development: {
        NODE_ENV: "development",
        TWITTER_API_KEY: "RGtlipy2oOnZ0nRYrH6kLylqa",
        TWITTER_API_SECRET:
          "6lu13SFKzwYq8BNIT8sZPOkl25AHltOYsxPbLbidCb4eEbvnVm",
        TWITTER_ACCESS_TOKEN:
          "1945491484654125056-pDMov8PC6XfhEa5xPQI8tyTnEAPJdN",
        TWITTER_ACCESS_SECRET: "5tv3Zw4XqnJ7oiNGUIYeb9Vdb5Hqq9H1Dkb0C3qDE9exH",
        HUGGING_FACE_API_KEY:
          "0c1fb95c37e445d222821fc46d0caa12:5506d832a28ee39e8917d19468f75fd0e4c46d52e212f904c4830acd392149cb508f55fcd341aa41676d9e6986a41b54",
        NEWS_API_KEY: "22de8e2c212e76b842c5add3e6c891ef:19a317d5faaf5faacc748c5036f6771fe6af453573f67ccb7b96c4180351e8fa31b7df4b1c295c3c5616b40803c902d0",
        REDIS_USERNAME:
          "0feb274aaa68a6df97b7e1c92e1c4ea6:5a7c9a4a878e8bc21173013105fc83fe",
        REDIS_PASSWORD:
          "f69cd657c79436b72e4ae75a0b83e13d:747a5ec04d32db08b2c2e980019b2f77",
        REDIS_HOST:
          "redis-12862.crce182.ap-south-1-1.ec2.redns.redis-cloud.com",
        REDIS_PORT: 12862,
        REDIS_DEFAULT_EXPIRY: 600,
        JWTSecret: "pallavihotlady"
      },
      env_production: {
        NODE_ENV: "production",
        TWITTER_API_KEY: "RGtlipy2oOnZ0nRYrH6kLylqa",
        TWITTER_API_SECRET:
          "6lu13SFKzwYq8BNIT8sZPOkl25AHltOYsxPbLbidCb4eEbvnVm",
        TWITTER_ACCESS_TOKEN:
          "1945491484654125056-pDMov8PC6XfhEa5xPQI8tyTnEAPJdN",
        TWITTER_ACCESS_SECRET: "5tv3Zw4XqnJ7oiNGUIYeb9Vdb5Hqq9H1Dkb0C3qDE9exH",
        HUGGING_FACE_API_KEY:
          "0c1fb95c37e445d222821fc46d0caa12:5506d832a28ee39e8917d19468f75fd0e4c46d52e212f904c4830acd392149cb508f55fcd341aa41676d9e6986a41b54",
        NEWS_API_KEY: "22de8e2c212e76b842c5add3e6c891ef:19a317d5faaf5faacc748c5036f6771fe6af453573f67ccb7b96c4180351e8fa31b7df4b1c295c3c5616b40803c902d0",
        REDIS_USERNAME:
          "0feb274aaa68a6df97b7e1c92e1c4ea6:5a7c9a4a878e8bc21173013105fc83fe",
        REDIS_PASSWORD:
          "f69cd657c79436b72e4ae75a0b83e13d:747a5ec04d32db08b2c2e980019b2f77",
        REDIS_HOST:
          "redis-12862.crce182.ap-south-1-1.ec2.redns.redis-cloud.com",
        REDIS_PORT: 12862,
        REDIS_DEFAULT_EXPIRY: 600,
        JWTSecret: "pallavihotlady"
      },
    },
  ],

  deploy: {
    production: {
      user: "SSH_USERNAME",
      host: "SSH_HOSTMACHINE",
      ref: "origin/master",
      repo: "GIT_REPOSITORY",
      path: "DESTINATION_PATH",
      "pre-deploy-local": "",
      "post-deploy":
        "npm install && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
    },
  },
};

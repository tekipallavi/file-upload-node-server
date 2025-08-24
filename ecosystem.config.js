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
          "ccc33a98225315bd03abbe238f33c644:956d433f7c107841727453cbd109aa8438ffef9a977065ef1757a2055eb85ace767433390fea8d38d99e8b44832bcaa5",
        REDIS_USERNAME:
          "0feb274aaa68a6df97b7e1c92e1c4ea6:5a7c9a4a878e8bc21173013105fc83fe",
        REDIS_PASSWORD:
          "f69cd657c79436b72e4ae75a0b83e13d:747a5ec04d32db08b2c2e980019b2f77",
        REDIS_HOST:
          "redis-12862.crce182.ap-south-1-1.ec2.redns.redis-cloud.com",
        REDIS_PORT: 12862,
        REDIS_DEFAULT_EXPIRY: 600,
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
          "ccc33a98225315bd03abbe238f33c644:956d433f7c107841727453cbd109aa8438ffef9a977065ef1757a2055eb85ace767433390fea8d38d99e8b44832bcaa5",
        REDIS_USERNAME:
          "0feb274aaa68a6df97b7e1c92e1c4ea6:5a7c9a4a878e8bc21173013105fc83fe",
        REDIS_PASSWORD:
          "f69cd657c79436b72e4ae75a0b83e13d:747a5ec04d32db08b2c2e980019b2f77",
        REDIS_HOST:
          "redis-12862.crce182.ap-south-1-1.ec2.redns.redis-cloud.com",
        REDIS_PORT: 12862,
        REDIS_DEFAULT_EXPIRY: 600,
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

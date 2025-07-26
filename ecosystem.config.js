module.exports = {
  apps: [
    {
      name: "server",
      script: "index.js",
      watch: true,
      env_dev: {
        NODE_ENV: "development",
        TWITTER_API_KEY: "RGtlipy2oOnZ0nRYrH6kLylqa",
        TWITTER_API_SECRET:
          "6lu13SFKzwYq8BNIT8sZPOkl25AHltOYsxPbLbidCb4eEbvnVm",
        TWITTER_ACCESS_TOKEN:
          "1945491484654125056-pDMov8PC6XfhEa5xPQI8tyTnEAPJdN",
        TWITTER_ACCESS_SECRET: "5tv3Zw4XqnJ7oiNGUIYeb9Vdb5Hqq9H1Dkb0C3qDE9exH",
        HUGGING_FACE_API_KEY:
          "ccc33a98225315bd03abbe238f33c644:956d433f7c107841727453cbd109aa8438ffef9a977065ef1757a2055eb85ace767433390fea8d38d99e8b44832bcaa5",
      },
      env_prod: {
        NODE_ENV: "production",
        TWITTER_API_KEY: "RGtlipy2oOnZ0nRYrH6kLylqa",
        TWITTER_API_SECRET:
          "6lu13SFKzwYq8BNIT8sZPOkl25AHltOYsxPbLbidCb4eEbvnVm",
        TWITTER_ACCESS_TOKEN:
          "1945491484654125056-pDMov8PC6XfhEa5xPQI8tyTnEAPJdN",
        TWITTER_ACCESS_SECRET: "5tv3Zw4XqnJ7oiNGUIYeb9Vdb5Hqq9H1Dkb0C3qDE9exH",
        HUGGING_FACE_API_KEY:
          "ccc33a98225315bd03abbe238f33c644:956d433f7c107841727453cbd109aa8438ffef9a977065ef1757a2055eb85ace767433390fea8d38d99e8b44832bcaa5",
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

/* require('./db/db-connection'); */

/* added for twitter code */
require("dotenv").config();
const { TwitterApi } = require("twitter-api-v2");
/* added for twitter code */

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("./db/db-connection");
const app = express();

/* added for twitter code */
app.use(bodyParser.json());
app.use(cors());
app.use(express.json()); // To parse JSON request bodies
const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

app.post("/tweet", async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Tweet content is required" });
  }

  try {
    const tweet = await twitterClient.v2.tweet(content);
    res.status(200).json({ success: true, tweet });
  } catch (error) {
    console.error("Error posting tweet:", error);
    res.status(500).json({ error: "Failed to post tweet" });
  }
});

/* added for twitter code */

mongoose.connection.on("open", () => {
  const authRoutes = require("./routes/auth-routes");
  const fileRoutes = require("./routes/file-routes");
  const aiRoutes = require("./routes/ai-routes");
  //app.use(cors());
  //app.use(bodyParser.json());
  app.use(authRoutes);
  app.use(fileRoutes);
  app.use(aiRoutes);
});



app.listen(process.env.PORT || 3001, () => {
  console.log("start listening!!");
});



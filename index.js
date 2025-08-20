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

/* kafka */
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-node-app',
  brokers: ['api-0d2da3de-fdff-4edd-a16e-6663d67e2434.kafka.discoveryv2.prod-s.eastus.azure.warpstream.com:9092'], // Replace with your Kafka broker
  ssl: true, // Enable if your cluster uses SSL
  sasl: {
    mechanism: 'plain', // or 'scram-sha-256', 'scram-sha-512'
    username: 'ccun_624aa0df5f86b269ed418336a9647f126cfa299b6fd582f53649c20b19fa98a7',
    password: 'ccp_287d8fd367a76379b318100f9a1db1f74044bb2ce651267ca1ead61ab09a8622',
  },
});


const producer = kafka.producer();

const runProducer = async () => {
  await producer.connect();
  await producer.send({
    topic: 'teki',
    messages: [{ value: 'Hello from Node.js!' }],
  });
  await producer.disconnect();
};

runProducer().catch(console.error);
/* kafka */

app.listen(process.env.PORT || 3001, () => {
  console.log("start listening!!");
});


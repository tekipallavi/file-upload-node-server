
const { InferenceClient } = require('@huggingface/inference');
const express = require('express');
const router = express.Router();
const { encrypt, decrypt } = require('../utils/key-decryption');
const NewsAPI = require('newsapi');
// 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
// db3d67ce45cc4b63b2e7144774b9042e
let api_key = decrypt(process.env.HUGGING_FACE_API_KEY, 'pallavi');

const hf = new InferenceClient(api_key);

router.get('/get-summary', async (req, res) => {

  const data = [
    {
      "matchId": 1,
      "eventType": "Goal",
      "description": "Harry Kane scores a header from a corner kick.",
      "timeStamp": "2023-10-01T15:30:00Z",
      "player": "Harry Kane",
      "team": "England"
    },
    {
      "matchId": 1,
      "eventType": "YellowCard",
      "description": "Foul - unsporting behaviour.",
      "timeStamp": "2023-10-01T15:32:00Z",
      "player": "Liam Brown",
      "team": "England"
    },
    {
      "matchId": 1,
      "eventType": "Goal",
      "description": "Raheem Sterling scores a brilliant solo goal.",
      "timeStamp": "2023-10-01T15:35:00Z",
      "player": "Raheem Sterling",
      "team": "England"
    },
    {
      "matchId": 1,
      "eventType": "Substitution",
      "description": "Jack Grealish replaces Marcus Rashford.",
      "timeStamp": "2023-10-01T15:37:00Z",
      "player": "Jack Grealish",
      "team": "England"
    },
    {
      "matchId": 1,
      "eventType": "RedCard",
      "description": "Harry Maguire sent off for a dangerous tackle.",
      "timeStamp": "2023-10-01T15:38:00Z",
      "player": "Harry Maguire",
      "team": "England"
    },
    {
      "matchId": 1,
      "eventType": "Goal",
      "description": "Bukayo Saka scores from outside the box.",
      "timeStamp": "2023-10-01T15:40:00Z",
      "player": "Bukayo Saka",
      "team": "England"
    },
    {
      "matchId": 1,
      "eventType": "Assist",
      "description": "Phil Foden provides a perfect cross for Kane's goal.",
      "timeStamp": "2023-10-01T15:42:00Z",
      "player": "Phil Foden",
      "team": "England"
    },
    {
      "matchId": 1,
      "eventType": "Penalty",
      "description": "Marcus Rashford converts a penalty kick.",
      "timeStamp": "2023-10-01T15:45:00Z",
      "player": "Marcus Rashford",
      "team": "England"
    },
    {
      "matchId": 1,
      "eventType": "Goal",
      "description": "Declan Rice scores a late equalizer.",
      "timeStamp": "2023-10-01T15:47:00Z",
      "player": "Declan Rice",
      "team": "England"
    },
    {
      "matchId": 1,
      "eventType": "YellowCard",
      "description": "Kyle Walker booked for time-wasting.",
      "timeStamp": "2023-10-01T15:50:00Z",
      "player": "Kyle Walker",
      "team": "England"
    }
  ];

  const pt = `You are a social media manager and football analyst.
Given the following football match events, do two things:
1. Write a catchy tweet (min 800 characters) summarizing the match highlights for fans.
2. Provide a brief analysis (2-3 sentences) of the match based on the events.`;

  const promptText = req.query.prompt || pt;

  const prompt = `
${promptText}

Events:
${JSON.stringify(data)}
`;

  if (!data || !Array.isArray(data)) {
    return res.status(400).send("Invalid data format");
  }

  try {


    const response = await getAISummary(prompt);
    // Extract summary text from response
    res.send(response.summary_text ? response.summary_text : response);


  } catch (error) {
    console.error("Error generating summary:", error);
    res.status(500).send("Error generating summary");
  }
});

router.get('/get-ai-summary', async (req, res) => {
  const prompt = req.prompt || 'Who won the AFCON semi-final match played last week?';

  if (!prompt) {
    res.status(500).send('Invalid prompt text');
  }

  try {
    const response = await getAISummary(prompt);
    res.status(200).send(response);
  } catch (e) {
    // handle error and send the specific error caught in response
    console.error("Error:", e.message);
    res.status(500).send(e.message);
  }
});

const getAISummary = async (prompt) => {
  const response = await hf.summarization({
    model: 'facebook/bart-large-cnn', // Use a summarization model supported by Hugging Face
    inputs: prompt,
    parameters: {
      max_length: 100, // Limit the response length
    },
  });
  console.log(response);
  return response;
}

async function getCelebrityNews(celebrityName) {
  try {
    const NEWS_API_KEY = decrypt(process.env.NEWS_API_KEY);
    const newsapi = new NewsAPI(NEWS_API_KEY);
    //// trying to fetch news from the past needs a paid plan, so can't use 'from', 'to' keys
    const response = await newsapi.v2.everything({
      q: celebrityName,
      language: 'en',
      sortBy: 'relevancy',
      pageSize: 10
    });
    if (!response || response.status !== 'ok') {
      throw new Error('Failed to fetch news articles');
    }
    const newsList = response.articles.map(article => ({
      title: article.title,
      description: article.description,
      source: article.source.name,
      publishedAt: article.publishedAt
    }));
    return newsList;
  } catch (error) {
    console.error("Error fetching from NewsAPI:", error.message);
  }
}

const constructPromptForNewsSummary = news => {
  /* const newsSample = [
    {
      title: 'Lina Esco reveals she and Ben Affleck were ‘giggling’ during sex scenes in ‘The Rip’',
      description: "The actress reflected on her and Affleck's romantic scenes.",
      source: 'New York Post',
      publishedAt: '2026-01-17T21:23:40Z'
    },
    {
      title: "21 queer sports films to watch after 'Heated Rivalry'",
      description: 'Find out where to stream these LGBTQ+ sports classics.',
      source: 'Out.com',
      publishedAt: '2026-01-17T11:00:02Z'
    }
  ]; */

  let prompt = `Summarize the following news articles about a celebrity into a concise summary:\n\n`;
  news.forEach((article, index) => {
    prompt += `Article ${index + 1}:\nTitle: ${article.title}\nDescription: ${article.description}\nSource: ${article.source}\nPublished At: ${article.publishedAt}\n\n`;
  });
  prompt += `Provide a brief summary of the key points from these articles.`;
  return prompt;
}

router.get('/summarize-news', async (req, res) => {
  const celebrity = req.params.celebrity || 'zendaya';
  try {
    const news = await getCelebrityNews(celebrity);
    if (news) {
      const prompt = constructPromptForNewsSummary(news);
      const response = await getAISummary(prompt);
      res.status(200).send(response);
    } else {
      throw new Error('No news articles found');
    }
  } catch (error) {
    console.error("Error fetching from NewsAPI:", error.message);
    res.status(500).send("Error fetching from NewsAPI:", error.message);
  }
});

module.exports = router;

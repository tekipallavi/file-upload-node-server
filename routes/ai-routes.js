
const { InferenceClient } = require('@huggingface/inference');
const express = require('express');
const router = express.Router();
const { encrypt, decrypt } = require('../utils/key-decryption');

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
   
        const input = `${prompt}\n\nData: ${JSON.stringify(data)}`;
        const response = await hf.summarization({
            model: 'facebook/bart-large-cnn', // Use a summarization model supported by Hugging Face
            inputs: prompt,
            parameters: {
                max_length: 100, // Limit the response length
            },
        });

        console.log(response);
        // Extract summary text from response
        res.send(response.summary_text ? response.summary_text : response);
            

    } catch (error) {
        console.error("Error generating summary:", error);
        res.status(500).send("Error generating summary");
    }
});

module.exports = router;

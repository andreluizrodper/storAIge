const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { prompt } = req.body;
  const requestData = JSON.stringify({
    model: "gpt-4",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    stream: false,
  });

  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPEN_AI_KEY}`,
    },
    body: requestData,
  };

  await fetch("https://api.openai.com/v1/chat/completions", fetchOptions)
    .then((response) => response.json())
    .then((data) => {
      const content = data.choices.map((res) => res.message.content);
      res.send({
        data: {
          content,
        },
      });
    });
});

module.exports = router;

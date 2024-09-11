const express = require("express");
const router = express.Router();

const sendEmail = async (subject, content, to) => {
  const key = process.env.SENDGRID_KEY;
  const payload = {
    personalizations: [
      {
        to: [to],
      },
    ],
    from: {
      name: process.env.SENDER_NAME,
      email: process.env.SENDER_EMAIL,
    },
    subject: subject,
    content: [
      {
        type: "text/html",
        value: content,
      },
    ],
  };
  const result = await fetch(`https://api.sendgrid.com/v3/mail/send`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return result;
};

router.post("/", async (req, res) => {
  const { subject, content, from, to } = req.body;

  const data = await sendEmail(subject, content, from, to);

  res.send(data);
});

module.exports = { router, sendEmail };

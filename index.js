const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

app.post("/", (req, res) => {
  const intent = req.body?.request?.intent?.name;

  let speechText = "I did not understand that.";
  console.log(JSON.stringify(req.body, null, 2));


  if (intent === "GreetIntent") {
    speechText = "Hello! This is your bot!";
  }

  res.json({
    version: "1.0",
    response: {
      outputSpeech: {
        type: "PlainText",
        text: speechText,
      },
      shouldEndSession: false
    }
  });
});

app.listen(3001, () => {
  console.log("Bot is running on port 3001");
});

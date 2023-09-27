const {onRequest,} = require("firebase-functions/v2/https");
const gpt = require('../util/gpt.util');
const line = require('../util/line.util');

exports.webhook = onRequest(async (request, response) => {

  if (request.method !== "POST") {
    return response.send(request.method);
  }

  const events = request.body.events
  for (const event of events) {
     
    if (event.type === "message" && event.message.type === "text") {
      const message = event.message.text;
          const response = await gpt.openaiRequest(message,event.source.userId);
          const payload = {
              type: "text",
              text: response,
          };
          line.reply(event.replyToken, [payload]);
    }

  }

  return response.send(request.method);

});
exports.generate_image = onRequest(async (request, response) => {

  if (request.method !== "POST") {
    return response.send(request.method);
  }

  const events = request.body.events
  for (const event of events) {
     
    if (event.type === "message" && event.message.type === "text") {
      const message = event.message.text;
          const response = await gpt.openaiRequestImage(message);
          const payload = {
            "type": "image",
            "originalContentUrl": response,
            "previewImageUrl": response
          };
          line.reply(event.replyToken, [payload]);
    }

  }

  return response.send(request.method);

});

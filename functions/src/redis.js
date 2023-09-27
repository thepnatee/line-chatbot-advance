const {onRequest,} = require("firebase-functions/v2/https");
const line = require('../util/line.util');
const redis = require('../util/redis.util');

exports.webhook = onRequest(async(request, response) => {
  if (request.method !== "POST") {
    return response.send(request.method);
  }

  if (!line.verifySignature(request.headers["x-line-signature"], request.body)) {
    return response.status(401).send("Unauthorized");
  }

  const events = request.body.events
  for (const event of events) {
     
    if (event.type === "message" && event.message.type === "text") {

        let users = await redis.getJsonObject('Users')

        let arrayUsers = users ? users : [];
        arrayUsers.push(event.source.userId)
        arrayUsers = [...new Set(arrayUsers)]

        redis.setJsonObject('Users',arrayUsers)
        await line.reply(event.replyToken, [{
            "type": "text",
            "text": JSON.stringify(event),
          }])
        return response.end();

    }
  }

  return response.send(request.method);

});
exports.getData = onRequest(async(request, response) => {

  let users = await redis.getJsonObject('Users')
  if (users) {
    let arrayUsers = users ? users : [];
    return response.json(arrayUsers)
  }
  return response.end();

});

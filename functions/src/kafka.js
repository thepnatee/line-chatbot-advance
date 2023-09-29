const {onRequest,} = require("firebase-functions/v2/https");
const line = require('../util/line.util');
const redis = require('../util/redis.util');
const flexProfile = require('../flex/profile');
const kafka = require('../util/kafka.util');

exports.pooling = onRequest(async(request, response) => {
  await kafka.poolingPushMessage()
  await kafka.poolingWebhookMessage()

  return response.send(request.method);

});

exports.webhook = onRequest(async(request, response) => {

  if (request.method !== "POST") {
    return response.send(request.method);
  }
  const events = request.body.events
  for (const event of events) {
    await kafka.send(process.env.KAFKA_TOPIC_WEBHOOK,event.replyToken,JSON.stringify(event))
  }

  return response.send(request.method);

});

exports.send = onRequest(async(request, response) => {

  const users = await redis.getJsonObject('Users')

  if (users) {
    for (const userId of users) {
      
      const profile = await line.getProfile(userId)
      const payload = await flexProfile.profile(userId,profile.data.pictureUrl,profile.data.displayName)
      const validate = await line.validatePush(payload)

      if (validate.status === 200) {
        await kafka.send(process.env.KAFKA_TOPIC_MESSAGE,userId,JSON.stringify(payload))

      }else{
        response.json(validate.data)
      }
      

    }
  }
  return response.send(request.method);

});




const {onRequest,} = require("firebase-functions/v2/https");
const line = require('../util/line.util');
const redis = require('../util/redis.util');
const flexProfile = require('../flex/profile');

exports.broadcast = onRequest(async(request, response) => {

  let payload = JSON.stringify({
    "messages": [
      {
        "type": "text",
        "text": "Hello, world"
      }
    ]
  });
  await line.broadcastConsumption(payload)
  return response.send(request.method);

});

exports.multicast = onRequest(async(request, response) => {


  const users = await redis.getJsonObject('Users')
  if (users) {

    const dataArray = users; 
    const maxLength = 500;
    const resultArray = [];
    
    for (let i = 0; i < dataArray.length; i += maxLength) {
      const subArray = dataArray.slice(i, i + maxLength);
      resultArray.push(subArray);
    }
    
    for (const userIds of resultArray) {
      let data = JSON.stringify({
        "to" : userIds,
        "messages": [
          {
            "type": "flex",
            "altText": "^^ vdo ^^",
            "contents": {
                "type": "bubble",
                "size": "giga",
                "hero": {
                    "type": "video",
                    "url": "https://workshop-ex10.s3.ap-southeast-1.amazonaws.com/vdo.mp4",
                    "previewUrl": "https://workshop-ex10.s3.ap-southeast-1.amazonaws.com/preview.png",
                    "aspectRatio": "1280:720",
                    "altContent": {
                        "type": "image",
                        "size": "full",
                        "url": "https://workshop-ex10.s3.ap-southeast-1.amazonaws.com/preview.png"
                    }
                }
            }
        }
        ]
      });
      await line.multicast(data)
    }
  }
  return response.send(request.method);

});

exports.push = onRequest(async(request, response) => {

  const users = await redis.getJsonObject('Users')
  if (users) {
    for (const userId of users) {
      console.log("getProfile",userId);
      const profile = await line.getProfile(userId)
      const flex_profile = await flexProfile.profile(userId,profile.data.pictureUrl,profile.data.displayName)
      await line.push(userId,flex_profile)
    }

  }
  return response.send(request.method);

});

exports.pushretry = onRequest(async(request, response) => {

  const users = await redis.getJsonObject('Users')
  if (users) {
    for (const userId of users) {
      const profile = await line.getProfile(userId)
      const flex_profile = await flexProfile.profile(userId,profile.data.pictureUrl,profile.data.displayName)
      await line.pushHandleRetryKey(userId,flex_profile)
    }

  }
  return response.send(request.method);

});
const { onRequest, } = require("firebase-functions/v2/https");
const line = require('../util/line.util');
// const redis = require('../util/redis.util');
// const flex_unix_time = require('../flex/unix_time');

exports.basic = onRequest(async (request, response) => {

  if (request.method !== "POST") {
    return response.send(request.method);
  }

  console.log(request.body);


  const events = request.body.events
  for (const event of events) {

    if (event.type === "message" && event.message.type === "text") {

      if (event.message.text === "tag") {

        await line.reply(event.replyToken, [{
          "type": "text",
          "text": "Hello, world"
        },
        {
          "type": "text",
          "text": JSON.stringify(event)
        }])

      }

    }

    console.log("------");
    console.log(event);
    console.log("------");

  }

  return response.send(request.method);

});

exports.destination = onRequest(async (request, response) => {

  if (request.method !== "POST") {
    return response.send(request.method);
  }

  console.log(request.body);
  const events = request.body.events

  /* 
   Channel 1 : U6ec263fe81b899d07506bdfd22008f73
   Channel 1 : Uaa23c850c183eb750ca24cb9f89dba90 
   */
  for (const event of events) {

    if (event.type === "message" && event.message.type === "text") {

      if (event.message.text === "tag") {
        await line.replyDestination(request.body.destination,event.replyToken,[{
          "type": "text",
          "text": `Hello, world ${request.body.destination}`
        },
        {
          "type": "text",
          "text": JSON.stringify(event)
        }])

      }

    }

  }

  return response.send(request.method);

});

exports.unix_time = onRequest(async(request, response) => {

  if (request.method !== "POST") {
    return response.send(request.method);
  }

  const currentTimeStamp = Math.floor(Date.now() / 1000)

  const events = request.body.events
  for (const event of events) {
     
    if (event.type === "message" && event.message.type === "text") {

      if (event.message.text === "flex") {
        /* adds 1 minute */
        const flex = await flex_unix_time.unix_time(currentTimeStamp + 60 );
        await line.replyShortLived(event.replyToken,[flex])
      }

    }else if(event.type === "postback"){
      const expireTime = event.postback.data
      let message = (currentTimeStamp > expireTime) ?  "❌ Time Out" : "✅ In Time"
      await line.reply(event.replyToken,[{
        "type": "text",
          "text": message
      }])

      return response.end()



    }

  }

  return response.send(request.method);

});

exports.signature = onRequest(async(request, response) => {

  if (request.method !== "POST") {
    return response.send(request.method);
  }

  if (!line.verifySignature(request.headers["x-line-signature"], request.body)) {
    return response.status(401).send("Unauthorized");
  }

  const events = request.body.events
  for (const event of events) {
     
    await line.reply(event.replyToken, [{ type: "text", text: JSON.stringify(event) }])
    return response.end();

  }

  return response.send(request.method);

});

exports.issuetokenv1 = onRequest(async(request, response) => {

  if (request.method !== "POST") {
    return response.send(request.method);
  }

  if (!line.verifySignature(request.headers["x-line-signature"], request.body)) {
    return response.status(401).send("Unauthorized");
  }

  const events = request.body.events
  for (const event of events) {
    await line.replyShortLived(event.replyToken, [{ type: "text", text: JSON.stringify(event) }])

  }

  return response.send(request.method);

});

exports.issuetokenv21 = onRequest(async(request, response) => {

  if (request.method !== "POST") {
    return response.send(request.method);
  }

  if (!line.verifySignature(request.headers["x-line-signature"], request.body)) {
    return response.status(401).send("Unauthorized");
  }

  const events = request.body.events
  for (const event of events) {
    await line.replySigningKey(event.replyToken, [{ type: "text", text: JSON.stringify(event) }])

  }

  return response.send(request.method);

});

exports.issuetokenv3 = onRequest(async(request, response) => {

  if (request.method !== "POST") {
    return response.send(request.method);
  }

  if (!line.verifySignature(request.headers["x-line-signature"], request.body)) {
    return response.status(401).send("Unauthorized");
  }

  const events = request.body.events
  for (const event of events) {
    await line.replyStateless(event.replyToken, [{ type: "text", text: JSON.stringify(event) }])

  }

  return response.send(request.method);

});

// exports.mission = onRequest(async (request, response) => {
//   if (request.method !== "POST") {
//     return response.send(request.method);
//   }
//   if (!line.verifySignature(request.headers["x-line-signature"], request.body)) {
//     return response.status(401).send("Unauthorized");
//   }

//   const events = request.body.events
//   for (const event of events) {
//     if (event.type === "postback" && event.postback && event.postback.data) {
//       const payload = JSON.parse(event.postback.data)
//       if (payload.action === 'like') {
//         const userId = payload.uid;
//         let userObject = await redis.getObject(userId)
//         let userJson = JSON.parse(userObject)
//         userJson.like = userJson.like + 1
//         redis.setObject(userId, JSON.stringify(userJson))
//         line.reply(event.replyToken, [{
//           "type": "text",
//           "text": "Like เรียบร้อย"
//         }]);
//       }
//     }
//   }
//   return response.send(request.method);
// });

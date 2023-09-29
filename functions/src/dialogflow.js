
const { onRequest, } = require("firebase-functions/v2/https");
const line = require('../util/line.util');
const dialogflow = require('../util/dialogflow.util');
const flexOrder = require('../flex/order');

exports.webhook = onRequest(async (request, response) => {

  if (request.method !== "POST") {
    return response.send(request.method);
  }

  if (!line.verifySignature(request.headers["x-line-signature"], request.body)) {
    return response.status(401).send("Unauthorized");
  }

  const events = request.body.events
  for (const event of events) {

    if (event.type === "message" && event.message.type === "text") {

      const profile = await line.getProfile(event.source.userId)

      const result = await dialogflow.postToDialogflowWithCredential(event.source.userId, event.message.text, profile.data.language)
      await line.reply(event.replyToken, [{
        "type": "text",
        "text": result.fulfillmentText,
        "sender": {
          "name": "พนักงานต้อนรับ",
          "iconUrl": "https://cdn-icons-png.flaticon.com/128/1211/1211059.png"
        },
        "quickReply": {
          "items": [
            {
              "type": "action",
              "imageUrl": "https://cdn-icons-png.flaticon.com/128/1149/1149810.png",
              "action": {
                "type": "message",
                "label": "เครื่องดื่ม",
                "text": "เครื่องดื่ม"
              }
            },
            {
              "type": "action",
              "imageUrl": "https://cdn-icons-png.flaticon.com/128/3198/3198662.png",
              "action": {
                "type": "message",
                "label": "ของหวาน",
                "text": "ของหวาน"
              }
            }
          ]
        }
      }])

      return response.end();
    }

  }

  return response.send(request.method);

});


exports.fulfillment = onRequest(async (request, response) => {
  console.log(JSON.stringify(request.body));
  if (request.body.queryResult.parameters.menu) {
    let session = request.body.session
    const user_id = session.substr(-33)
    const flex_oder = await flexOrder.order(user_id, request.body.queryResult.parameters.menu)
    await line.push(user_id, flex_oder)
  }
  return response.send(request.method);

});

exports.webhookeasy = onRequest(async (request, response) => {

  if (request.method !== "POST") {
    return response.send(request.method);
  }

  // if (!line.verifySignature(request.headers["x-line-signature"], request.body)) {
  //   return response.status(401).send("Unauthorized");
  // }

  const events = request.body.events
  for (const event of events) {




    if (event.type === "message" && event.message.type === "text") {

      await dialogflow.postToDialogflow(request)
      return response.end();
    }

  }

  return response.send(request.method);

});

exports.fulfillmenteasy = onRequest(async (request, response) => {

  console.log(JSON.stringify(request.body));




  if (request.body.originalDetectIntentRequest.source === "line") {
    const replyToken = request.body.originalDetectIntentRequest.payload.data.replyToken
    const userId = request.body.originalDetectIntentRequest.payload.data.source.userId
    const flex_oder = await flexOrder.order(userId, request.body.queryResult.parameters.menu)


    console.log("replyToken", replyToken);
    console.log("userId", userId);
    console.log("flex_oder", flex_oder);

    await line.reply(replyToken, [flex_oder])
  }
  return response.send(request.method);

});
const { onRequest, } = require("firebase-functions/v2/https");
const line = require('../util/line.util');
const flexBucket = require('../flex/bucket');
const firebase = require('../util/firebase.util')
// const redis = require('../util/redis.util');
// const flex_unix_time = require('../flex/unix_time');

exports.storage = onRequest(async (request, response) => {

  if (request.method !== "POST") {
    return response.send(request.method);
  }

  if (!line.verifySignature(request.headers["x-line-signature"], request.body)) {
    return response.status(401).send("Unauthorized");
  }

  const events = request.body.events
  for (const event of events) {

    /* Using LINE Group Only */
    if (event.source.type !== "group") {
      return res.end();
    }


    /*🔥 1. Join to Chat Group 🔥
    https://developers.line.biz/en/reference/messaging-api/#join-event
    */
    if (event.type === "join") {
      await line.reply(event.replyToken, [flexBucket.welcomeMessage()])
      return res.end();
    }

    /* 🔥 2. Member Joined to Chat Group 🔥
    https://developers.line.biz/en/reference/messaging-api/#member-joined-event
    }*/
    if (event.type === "memberJoined") {
      for (let member of event.joined.members) {
          if (member.type === "user") {
              /* ✅ 2.1 [memberJoined] reply util.reply(event.replyToken,[messages.welcomeMessage()]) */
              await line.reply(event.replyToken, [flexBucket.memberJoinedMessage(profile.data.displayName, event.source.groupId)])
          }
      }
      return res.end();
    }

      /* 🔥 3. Event Message is ['image', 'audio', 'video', 'file'] 🔥
      https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects
      }*/
      const validateEventType = ['image', 'audio', 'video', 'file']
      if (event.type === "message" && validateEventType.includes(event.message.type)) {

          /* ✅ 3.1 Get Content By API  
          https://developers.line.biz/en/reference/messaging-api/#get-content
          */
          const binary = await line.getContent(event.message.id)


          /* ✅ 3.2 Upload Firebase Storage Bucket -> Convert binary  to Medie file  */
          const publicUrl = await firebase.saveImageToStorage(event.message, event.source.groupId, binary)


          /* ✅ 3.3 Insert Object to Firestore  */
          await firebase.insertImageGroup(event.source.groupId, event.message.id, publicUrl)

          /* ✅ 3.4 Reply View album  */
          await line.reply(event.replyToken, [flexBucket.imageView(event.message.id, publicUrl)])

          return res.end();
      }

      /* 🔥 4. Leave From Chat Group 🔥
      https://developers.line.biz/en/reference/messaging-api/#leave-event
      */
      if (event.type === "leave") {
        await firebase.deleteGroup(event.source.groupId)
        return res.end();
      }


  }

  return response.send(request.method);

});
const { onRequest, } = require("firebase-functions/v2/https");
const cors = require('cors')({ origin: true });
const line = require('../util/line.util');
const redis = require('../util/redis.util');
const flex = require('../flex/user.js');

exports.auth = onRequest(async(request, response) => {
  cors(request, response, async () => {
    const token = request.body.token
    const tokenVerify = await line.verifyIDToken(token)
    const userId = tokenVerify.sub;
    const userObject = {
      phone: request.body.phone,
      userId
    }
    redis.setObject(userId, JSON.stringify(userObject))

    const richmenuId = process.env.WK_RICHMENU_ID
    const liffId = process.env.WK_LIFF_ID
    await line.linkRichMenu(userId, richmenuId)
    await line.pushLineNotify(`ลงทะเบียนผู้ใช้ใหม่ https://liff.line.me/${liffId}?uid=${userId}`);
    response.send({ result: 'OK', userObject });
  })
});
// exports.register = onRequest(async(request, response) => {
//   cors(request, response, async () => {
//     const token = request.body.token
//     const tokenVerify = await line.verifyIDToken(token)
//     const userId = tokenVerify.sub;
//     const userObject = {
//       name: request.body.name,
//       email: request.body.email,
//       gender: request.body.gender,
//       pictureUrl: tokenVerify.picture,
//       like: 0,
//       userId
//     }
//     redis.setObject(userId, JSON.stringify(userObject))

//     const richmenuId = process.env.WK_RICHMENU_ID
//     const liffId = process.env.WK_LIFF_ID
//     await line.linkRichMenu(userId, richmenuId)
//     await line.pushLineNotify(`ลงทะเบียนผู้ใช้ใหม่ https://liff.line.me/${liffId}?uid=${userId}`);
//     await line.broadcast({
//       "messages": [
//         flex.getUserFlex(userId, tokenVerify.picture, request.body.name)
//       ]
//     })
//     response.send({ result: 'OK', userObject });
//   })
// });

// exports.info = onRequest(async(request, response) => {
//   cors(request, response, async () => {
//     let uid = request.query.uid
//     let userObject = await redis.getObject(uid)
//     response.send({ result: 'OK', userObject });
//   })
// });
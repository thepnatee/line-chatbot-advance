const { onRequest, } = require("firebase-functions/v2/https");
const cors = require('cors')({ origin: true });
const line = require('../util/line.util');
const redis = require('../util/redis.util');
const flex = require('../flex/user.js');

exports.register = onRequest({ region: "asia-northeast1" }, (request, response) => {
  cors(request, response, async () => {
    const token = request.body.token
    const tokenVerify = await line.verifyIDToken(token)
    const userId = tokenVerify.sub;
    const userObject = {
      name: request.body.name,
      email: request.body.email,
      gender: request.body.gender,
      pictureUrl: tokenVerify.picture,
      like: 0,
      userId
    }
    redis.setObject(userId, JSON.stringify(userObject))

    const richmenuIdB = 'richmenu-55a61b05efed1e174f9ee3e54d8506c0'
    await line.linkRichMenu(userId, richmenuIdB)
    await line.pushLineNotify(`ลงทะเบียนผู้ใช้ใหม่ https://liff.line.me/2000198531-AZpzJ9K0?uid=${userId}`);
    await line.broadcast({
      "messages": [
        flex.getUserFlex(userId, tokenVerify.picture, request.body.name)
      ]
    })
    response.send({ result: 'OK', userObject });
  })
});

exports.info = onRequest({ region: "asia-northeast1" }, (request, response) => {
  cors(request, response, async () => {
    let uid = request.query.uid
    console.log('Sitthi : uid: ', uid);
    let userObject = await redis.getObject(uid)
    console.log('Sitthi : userObject: ', userObject);
    response.send({ result: 'OK', userObject });
  })
});
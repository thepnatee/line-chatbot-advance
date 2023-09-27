const {onRequest,} = require("firebase-functions/v2/https");
const redis = require('../util/redis.util');
const line = require('../util/line.util');


exports.notify = onRequest(async(request, response) => {

  if (request.method !== "GET") {
    return response.send(request.method);
  }
  const users = await redis.getJsonObject('Users')
  if (users) {
    await line.pushLineNotify(users.length)
  }
  return response.send(request.method);

});
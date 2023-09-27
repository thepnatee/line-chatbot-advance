const redis = require('redis');
              
const client = redis.createClient ({
  url : process.env.REDIS_KEY
});

client.on("error", function(err) {
  throw err;
});
  
exports.setObject = async (key, value) => {
    await client.connect()
    const result = await client.set(key, value)
    await client.disconnect();
    return result
}
   
exports.getObject = async (key, value) => {
    await client.connect()
    const result = await client.get(key, value)
    await client.disconnect();
    return result
}

exports.setJsonObject = async (key, value) => {
  await client.connect()
  const result = await client.json.set(key,'$', value)
  await client.disconnect();
  return result
}
exports.getJsonObject = async (key, value) => {
    await client.connect()
    const result = await client.json.get(key,'$',value)
    await client.disconnect();
    return result
}
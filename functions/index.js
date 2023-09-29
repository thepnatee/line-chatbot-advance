const { setGlobalOptions } = require("firebase-functions/v2");


setGlobalOptions({
    region: "asia-northeast1",
    memory: "1GB",
    concurrency: 40
})

exports.webhook = require('./src/webhook')
// exports.redis = require('./src/redis')
// exports.kafka = require('./src/kafka')
// exports.dialogflow = require('./src/dialogflow')
// exports.message = require('./src/message')
// exports.cron = require('./src/cron')
// exports.gpt = require('./src/gpt')
// exports.bonus = require('./src/taey_ty')
// exports.bucket = require('./src/bucket')
// exports.register = require('./src/register')





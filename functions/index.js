const { setGlobalOptions } = require("firebase-functions/v2");


setGlobalOptions({
    region: "asia-northeast1",
    memory: "1GB",
    concurrency: 40
})

exports.webhook = require('./src/webhook')
exports.bucket = require('./src/bucket')
// exports.message = require('./src/message')
// exports.dialogflow = require('./src/dialogflow')
// exports.kafka = require('./src/kafka')
// exports.cron = require('./src/cron')
// exports.register = require('./src/register')
// exports.redis = require('./src/redis')
// exports.gpt = require('./src/gpt')
// exports.bonus = require('./src/taey_ty')




const { Kafka } = require('kafkajs')
const line = require('./line.util');
 
const kafka = new Kafka({
    brokers: [`${process.env.KAFKA_BROKERS}`],
    sasl: {
        mechanism: process.env.KAFKA_MECHANISM,
        username: process.env.KAFKA_USERNAME,
        password: process.env.KAFKA_PASSWORD,
    },
     ssl: true,
})

exports.send = async (topic,key,payload) => {
    try {
   
    const producer = kafka.producer();
    await producer.connect();

    const message = {
      key: key, // Optional: You can provide a key for message partitioning
      value: payload // The actual message payload
    };

    await producer.send({
      topic: topic, // Replace with the desired Kafka topic
      messages: [message]
    });

    await producer.disconnect();
      
    return "Kafka message produced successfully!"
      }  catch (error) {
        console.error('Error producing to Kafka:', error);
        return 'Error producing to Kafka'
      }

};
 
exports.poolingPushMessage = async () => {
   
    const consumer = kafka.consumer({ groupId: 'push-group' });
    await consumer.connect();
    await consumer.subscribe({ topic: process.env.KAFKA_TOPIC_MESSAGE, fromBeginning: true });

    await consumer.run({
        eachBatch: async ({ batch, resolveOffset, heartbeat, isRunning }) => {
          for (const message of batch.messages) {
            // Process the Kafka message
            console.log({
                key: message.key.toString(),
                value: message.value.toString(),
            });
            // Perform any necessary operations with the Kafka message data
            await line.push(message.key.toString(), JSON.parse(message.value))
          }
        },
      });
};

exports.poolingWebhookMessage = async () => {
   
    const consumer = kafka.consumer({ groupId: 'webhook-group' });
    await consumer.connect();
    await consumer.subscribe({ topic: process.env.KAFKA_TOPIC_WEBHOOK, fromBeginning: true });

    await consumer.run({
        eachBatch: async ({ batch, resolveOffset, heartbeat, isRunning }) => {
          for (const message of batch.messages) {
            // Process the Kafka message
            console.log({
                key: message.key.toString(),
                value: message.value.toString(),
            });
            await line.reply(message.key.toString(), [{
              "type": "text",
              "text": message.value.toString(),
            }])
            // Perform any necessary operations with the Kafka message data
          }
        },
      });
};
 
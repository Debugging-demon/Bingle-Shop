'use strict'
const path = require('path')

module.exports = {
    namespace: 'my_project_name',
    redis: {
        client: 'redis',
        options: {
            host: '127.0.0.1',
            port: 6379,
            connect_timeout: 3600000,
        },
    },
    logger: {
        enabled: true,
        options: {
            level: 'info',
            /*
            streams: [
                {
                    path: path.normalize(`${__dirname}/../logs/redis-smq.log`)
                },
            ],
            */
        },
    },
    messages: {
      store: false,
    },
    
}


const { QueueManager } = require('redis-smq');
const { EQueueType } = require('redis-smq/dist/types');
const config = require('./config')

QueueManager.createInstance(config, (err, queueManager) => {
  if (err) console.log(err);
  // Creating a LIFO queue
  else queueManager.queue.save('test_queue', EQueueType.LIFO_QUEUE, (err) => console.log(err));
})

const { Message } = require('redis-smq');
const message = new Message();
message
    .setBody({hello: 'world'})
    .setTTL(3600000)
    .setRetryThreshold(5);




    'use strict';
const {Message, Producer} = require('redis-smq');

const producer = new Producer();
producer.run((err) => {
   if (err) throw err;
   const message = new Message();
   message
           .setBody({hello: 'world'})
           .setTTL(3600000) // message expiration (in millis)
           .setQueue('test_queue'); // setting up a direct exchange 
   message.getId() // null
   producer.produce(message, (err) => {
      if (err) console.log(err);
      else {
         const msgId = message.getId(); // string
         console.log('Successfully produced. Message ID is ', msgId);
      }
   });
})


'use strict';

const { Consumer } = require('redis-smq');

const consumer = new Consumer();

const messageHandler = (msg, cb) => {
   const payload = msg.getBody();
   console.log('Message payload', payload);
   cb(); // acknowledging the message
};

consumer.consume('test_queue', messageHandler, (err) => {
   if (err) console.error(err);
});

consumer.run();
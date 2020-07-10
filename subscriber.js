var redis = require('redis');
var redisSubscriber = redis.createClient();




redisSubscriber.on('subscribe', function (channel, count) {


    console.log('client subscribed to ' + channel + ', ' + count + ' total subscriptions so far');
});


redisSubscriber.on('message', function (channel, message) {
    console.log('client channel ' + channel + ': ' +  message);

});




// Subcribe to locationUpdate
redisSubscriber.subscribe("locationUpdate", data => {

    console.log(data);

})
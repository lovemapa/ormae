var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var redis = require('redis');
const { type } = require('os');
var redisPublisher = redis.createClient();




var io = require('socket.io')(http); var port = process.env.PORT || 3000;



io.on('connection', (socket => {

    console.log(`Socket Connected`);

    socket.on('disconnect', () => {
        console.log(`disconnected`);

    })


    //function for simulating arbitrary vehicles to send their live location every two second
    liveLocationByVehicles = () => {
        var count = 1;
        setInterval(function () {
            console.log(count);


            var precision2 = 100; // 2 decimals
            var randomnum2 = Math.floor(Math.random() * (10 * precision2 - 1 * precision2) + 1 * precision2) / (1 * precision2);
            var vehicle = {};

            var precision1 = 100; // 2 decimals
            var randomnum = Math.floor(Math.random() * (10 * precision1 - 1 * precision1) + 1 * precision1) / (1 * precision1);
            var vehicle = {};
            vehicle.vehicleId = Math.random()
            vehicle.Coordinate = {};
            vehicle.lastMoved = new Date()
            vehicle.Coordinate.Longitude = randomnum;
            vehicle.Coordinate.Latitude = randomnum2;
            count++;
            // console.log(vehicle);   // vehicle Object

            socket.emit('sendLiveLocation', vehicle);


        }, 2000);
    }



    getLiveLocationByServer = () => {


        socket.on('sendLiveLocation', function (data) {

            diff = new Date().getTime() - new Date(data.lastMoved).getTime() //millisecond

            if (diff / (1000) <= 10)   // if last Moved  within 10 seconds then true else false
                data.hasMovedSincelastTenSeconds = true
            else
                data.hasMovedSincelastTenSeconds = false

            var location = JSON.stringify(data);

            redisPublisher.publish('locationUpdate', location);

        });

    }

    liveLocationByVehicles()
    getLiveLocationByServer()



}))







http.listen(port, () => {
    console.log(`server is running on port ` + port);
});



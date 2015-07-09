var config = require('./config.json');
var express = require('express');
var app = express();
var fs = require('fs');
var privateKey  = fs.readFileSync('server.key', 'utf8');
var certificate = fs.readFileSync('server.crt', 'utf8');
var credentials = { key: privateKey, cert: certificate };
var server = require('https').createServer(credentials, app);
var geolocation = require('./geolocation');

server.listen(config.port, function () {
    console.log('Server listening at port: ', config.port);
});

app.all('/geo', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	next();
});

app.get('/geo', function (req, res) {
	var options = {
		units: 'miles',
		conversionToMiles: 69,
		maxRadius: 10
	};
    var d1 = new Date();
	geolocation.findNearbyLocations(options, req.query, function(nearby) {
        var d2 = new Date();
        console.log(d2-d1);
        console.log(nearby);
        res.send(nearby);
	});
});
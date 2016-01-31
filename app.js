var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var loaded = 0;
var currentlyOpening = 0;
var registered = [];
var idCounter = 0;

server.listen(8000);

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.get('/play', function (req, res){
	res.sendFile(__dirname + '/play.html');
});

app.get('/control', function (req, res){
	res.sendFile(__dirname + '/control.html');
});

io.on('connection', function(socket) {

	socket.on('open', function (data) {
        loaded = 0;
        currentlyOpening = 0;
        console.log('open ' + data);
        socket.broadcast.emit('open', data);
	});

	socket.on('play', function (data){
		console.log('play');
		socket.broadcast.emit('play');
	});

	socket.on('pause', function (data){
		console.log('pause');
		socket.broadcast.emit('pause');
	});

	socket.on('stop', function(data){
		console.log('stop');
		socket.broadcast.emit('stop');
	});

	socket.on('ready', function(data){
		loaded += 1;

		if (loaded == currentlyOpening){
			socket.broadcast.emit('ready');
		}

		console.log('ready');
	});

	socket.on('ackopen', function(data){
		console.log('ackopen');
		currentlyOpening += 1;
	});

	socket.on('register', function(data){
		console.log('registeredName ' + data);

		var newName;

		if (data){
			newName = data;
		}
		else {
			newName = String(idCounter);
			idCounter += 1;
		}

		registered.push(newName);
		socket.emit('registeredName', newName);
	});

	socket.on('getRegistered', function(data){

		socket.emit('getRegisteredResponse', registered);

	});

});

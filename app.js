var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

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
        console.log("open " + data);
        socket.broadcast.emit('open', data);
	});

	socket.on('play', function (data){
		console.log("play");
		socket.broadcast.emit('play');
	});

	socket.on('stop', function(data){
		console.log("stop");
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
		console.log("ackopen");
		currentlyOpening += 1;
	});

});

/*

	Accepts:
		castrato.on('host:connect', connect);
		castrato.on('host:disconnect', disconnect);

	Emits:
		castrato.emit('host:connected');
		castrato.emit('host:disconnected');
		castrato.emit('host:error', e);

*/
define(
	{
		compiles: ['$'],
		requires: ['fandango','castrato']
	}, function ($, requires, data) { 

	var 

		// Private properties
		socket,
		host,

		// Require shortcuts
		castrato = requires.castrato,

		connect = function () {

			// The one  and only socket
			socket = $.Websocket.connect("", {
				forceNew: true,
				'force new connection': true
			});

			// Bind socket events
			socket
				.on('connect', function () {
					castrato.emit('host:connected');
				})

				.on('disconnect', function () {
					castrato.emit('host:disconnected');
				})

				.on('error', function (e) {
					castrato.emit('host:error',e);
				});

			return;
		},

		disconnect = function () {
			socket.disconnect();
		};

	castrato.on('host:connect', connect);
	castrato.on('host:disconnect', disconnect);

});
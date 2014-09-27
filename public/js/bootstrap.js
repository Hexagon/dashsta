// This Javascript file is the only file besides fandango.js that will be fetched through DOM.

// Setup fandango
fandango.defaults({
	baseUrl: 'js/dashsta_modules/',
	paths: {
		websocket: '//cdnjs.cloudflare.com/ajax/libs/socket.io/0.9.16/socket.io.min.js',
		domReady: '//cdnjs.cloudflare.com/ajax/libs/require-domReady/2.0.1/domReady.min.js'
	}
});

// Require main cryptalk module.
require(['dashsta'], function () {}, function (e) {
	if (console.log) {
		console.log('Error thrown on initialization: ', e);
	}
});

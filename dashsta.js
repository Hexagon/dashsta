#!/usr/bin/env node
var express = require('express.io'),
    app = express();app.http().io();

app.use(express.static(__dirname + '/public'));

app.io.route('status', {

    // Returns current memory usage on host
    memory: function(req) {
      req.socket.emit('status:memory',{
        total: os.totalmem(),
        free: os.freemem()
      });
    },

    // Retuns full list of datasources
    datasources: function() {

    }
});

app.io.sockets.on('connection', function(socket) {
   //socket.on('disconnect', function() { });
});

app.listen(8088, function(){
  console.log('listening on *:8088');
});

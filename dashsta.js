#!/usr/bin/env node

var express = require('express.io'),
    app = express();app.http().io();

app.use(express.static(__dirname + '/public'));


app.io.route('status', {
    memory: function() {
      {
        req.socket.emit('status:memory',{
          total: os.totalmem(),
          free: os.freemem()
        });
      }
    }
});

app.io.sockets.on('connection', function(socket) {
  console.log('Got a connection');
   /*socket.on('disconnect', function() {
  
   });*/
});

app.listen(8088, function(){
  console.log('listening on *:8088');
});

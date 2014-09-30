#!/usr/bin/env node
var express = require('express.io'),
    app = express();app.http().io(),
    ramdb = require('./ramdb.js');

// Expose all files in /public through HTTP
app.use(express.static(__dirname + '/public'));

// Try out the ram database
ramdb.updateDataset('test'); // This should have 2 parameters, the second one beeing a json representation of the table to insert
ramdb.query("SELECT rowid AS id, test FROM test",function(err,dataset){console.log(dataset)});

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

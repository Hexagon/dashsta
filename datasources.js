var config = require('./config.json'),
  	fs = require("fs");

var datasources = {

  all: [],

  Init: function (cache) {

    // Read all datasources
    var result = fs.readdirSync("./datasources");

    for( var i=0 ; i<result.length ; i++ ) {
    	
      try {

        file = result[i];

        // Do not include example datasources
        if( file.substring(0,8) !== "example.") {

          // Ok, now we create an instance of datasource.js, 
          // and assign current datasource as config to it
          var fresh = require("./datasource.js");
          fresh.readProperties("./datasources/" + file);
          this.all.push(fresh);

          console.log('\tDatasource loaded: ',file);

        }

      } catch (err) {
        console.error('\tFailed to load datasource: ' + file, err);
      }

    };

    // Start time tick notifier
    this.notifyTimeTick();

  },
  notifyTimeTick: function() {

    // Notify all triggers of time tick
    var d = new Date();
    for( var i=0 ; i<this.all.length ; i++ ) if(this.all[i].notifyTimeTick != undefined) this.all[i].notifyTimeTick(d);

    // Recurse to infinity ( or at least until the power goes out! )
    setTimeout(function() { this.notifyTimeTick() }.bind(this), 1000 );

  }


};

module.exports = datasources;
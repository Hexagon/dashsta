var config = require('./config.json'),
	fs = require("fs");

var datasources = {

	all: [],

	Init: function (cache) {

		// Read all datasources
		var result = fs.readdirSync("./datasources"),
			DataSource = require("./datasource.js"),
			fresh;

		for( var i=0 ; i<result.length ; i++ ) {
			
			// DataSource constructor may or may not throw
			// so we wrap the whole loader in a try...catch
			try {

				file = result[i];

				// Do not include example datasources
				if( file.substring(0,8) !== "example.") {

					fresh = new DataSource('./datasources/' + file);
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
		var d = new Date().now();
		for( var i=0 ; i<this.all.length ; i++ ) if(this.all[i].notifyTimeTick != undefined) this.all[i].notifyTimeTick(d);

		// Recurse to infinity ( or at least until the power goes out! )
		setTimeout(function() { this.notifyTimeTick() }.bind(this), 1000 );

	}
};

module.exports = datasources;
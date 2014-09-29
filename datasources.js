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
		
	  try {

		file = result[i];

		// Do not include example datasources
		if( file.substring(0,8) !== "example.") {

		  // Ok, now we create an instance of datasource.js, 
		  // and assign current datasource as config to it
		  // 
		  // Requires körs endast en gång
		  //  Återanvänder metoder m.a.o. prototyping istället för att skapa nya
		  //  Mer cleant och intuitivt (enligt mig iaf) och en faktiskt egen instans med riktig constructor:
		  //  
		  //  var ds = new DataSource('file.js');
		  //  (ds instanceof DataSource) // true
		  //  
		  //  Lite krångligare, lite mer error-prone. Ett stil många js-utvecklare inte gillar.
		  fresh = new DataSource('./datasources/' + file);

		  fresh.variable // 'hello'
		  fresh._private // undefined
		  fresh.getPrivate(); // blabla
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
sqlite3 = require('sqlite3');

module.exports = (function () {

	var shared = {},
		db = new sqlite3.Database(':memory:');

	// function privatefunc () {};

	shared.updateDataset = function(name,data) {
		db.serialize(function() {
			db.run("CREATE TABLE test (test TEXT)");

			var stmt = db.prepare("INSERT INTO test VALUES (?)");
			for (var i = 0; i < 10; i++) {
				stmt.run("test " + i);
			}

			stmt.finalize();
		});
	};

	shared.query = function(query,callback) {
	  db.all(query, callback);
	};

	shared.cleanUp = function() {
		this.db.close();
	};

    return shared;

})();
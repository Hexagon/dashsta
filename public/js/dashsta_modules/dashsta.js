/*

	Main Dashsta module

	Accepts:
		castrato.on("host:connected");

	Emits:
		castrato.emit("host:connect");
*/

define({
	compiles: ['$'],
	requires: ['castrato','host']
}, function ($, requires, data) {

	var castrato = requires.castrato;

	// Ohyeah, ready to get kicking!
	castrato.on("host:connected", function() {
		
	}); 

	castrato.emit("host:connect");

});
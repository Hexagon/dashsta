/*

	Accepts:
		castrato.on("interface:clear", ...); 
		castrato.on("interface:box", ...); 
*/

define({
	compiles: ['$'],
	requires: ['castrato']
}, function ($, requires, data) {

	var 
		// Require shortcuts
		castrato = requires.castrato,

		// DOM element shortcuts
		components = {
			content: $('#content')
		},

		// Private methods

		// Public methods (exposed through castrato)
		clear = function() {
			components.content[0].innerHTML = '';
		},

		box = function(d,done) {
			var box = document.createElement('div');
			box.className = 'box box-w'+d.w+' box-h'+d.h+' bg-'+d.background;
			if ("id" in d) {
				box.id = d.id;
			}
			if ("parent" in d) {
				d.parent[0].appendChild(box);
			}
			else
				components.content[0].appendChild(box);
			if ( done !== undefined ) done();
		},

		container = function(d,done) {
			var container = document.createElement('div');
			container.className = 'container container-w'+d.w+' container-h'+d.h;
			components.content[0].appendChild(container);
			done(container);
		};

	// Expose public methods
	castrato.on("interface:clear", clear); 
	castrato.on("interface:container", container); 
	castrato.on("interface:box", box); 

});
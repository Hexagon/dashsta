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
		}

		// Private methods

		// Public methods (exposed through castrato)
		clear = function() {
			components.content[0].innerHTML = '';
		},

		box = function(d) {
			var box = document.createElement('div');
			box.className = 'box box-w'+d.w+' box-h'+d.h+' bg-'+d.background;
			if("parent" in d) {
				console.log(d);
				d.parent[0].appendChild(box);
			}
			else
				components.content[0].appendChild(box);
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
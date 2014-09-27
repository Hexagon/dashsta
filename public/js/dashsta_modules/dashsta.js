/*

	Main Dashsta module

	Accepts:
		castrato.on("host:connected");

	Emits:
		castrato.emit("host:connect");
		castrato.emit("interface:clear");

*/

define({
	requires: ['castrato','host','interface']
}, function (requires, data) {

	var c = requires.castrato;

	// Ohyeah, ready to get kicking!
	c.on("host:connected", function() {

		// Make sure the stage is set
		c.emit("interface:clear");

		// Row 1
			// Create a container 3 units wide and 3 units high, and place 3 subboxes in it
			// 	1 unit is 10% width
			// 	1 unit is 40px of height
			c.emit("interface:container",{w:3,h:3},function(p) {
				// In containers, both width and height are in percentage, of parent container
				c.emit("interface:box",{w:10,h:6,background:'primary',parent:p});
				c.emit("interface:box",{w:10,h:4,background:'tertiary',parent:p});
			});

			c.emit("interface:box",{w:3,h:3,background:'tertiary'});
			c.emit("interface:box",{w:4,h:3,background:'tertiary'});

		// Row 2
		c.emit("interface:box",{w:4,h:4,background:'primary'});
		c.emit("interface:container",{w:6,h:4},function(p) {
			c.emit("interface:box",{w:10,h:4,background:'primary',parent:p});
			c.emit("interface:box",{w:10,h:2,background:'tertiary',parent:p});
			c.emit("interface:box",{w:10,h:2,background:'tertiary',parent:p});
			c.emit("interface:box",{w:10,h:2,background:'tertiary',parent:p});
		});

		// Row 3		
		c.emit("interface:box",{w:2,h:3,background:'tertiary'});
		c.emit("interface:box",{w:4,h:3,background:'secondary'});
		c.emit("interface:box",{w:2,h:3,background:'primary'});
		c.emit("interface:box",{w:2,h:3,background:'tertiary'});
	}); 

	c.emit("host:connect");

});
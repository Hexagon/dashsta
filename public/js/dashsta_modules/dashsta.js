/*

	Main Dashsta module

	Accepts:
		castrato.on('host:connected');

	Emits:
		castrato.emit('host:connect');
		castrato.emit('interface:clear');

*/
define(['castrato', 'grapho', 'host', 'interface'], function (c, Grapho) {

	// Ohyeah, ready to get kicking!
	c.on('host:connected', function() {

		// Make sure the stage is set
		c.emit('interface:clear');

		// Row 1
			// Create a container 3 units wide and 3 units high, and place 3 subboxes in it
			// 	1 unit is 10% width
			// 	1 unit is 40px of height
			c.emit('interface:container',{w:3,h:3},function(p) {
				// In containers, both width and height are in percentage, of parent container
				c.emit('interface:box',{w:10,h:6,background:'primary',parent:p});
				c.emit('interface:box',{w:10,h:4,background:'tertiary',parent:p});
			});

			c.emit('interface:box',{w:3,h:3,background:'tertiary'});
			c.emit('interface:box',{w:4,h:3,background:'tertiary'});

		// Row 2
		c.emit('interface:box',{w:4,h:6,background:'primary', id:'graph'}, function() {
			// With `new` keyword
			(new Grapho({
					data: [1,5,7,6,5,2,5,5,6,7,8,8,9,9,8,7,5,5,6,7,6,5,5,2,4,5,4],
					type: 'line',
					debug: true,
					place: document.getElementById('graph')
				})
			);
		});

		c.emit('interface:container',{w:6,h:6},function(p) {
			c.emit('interface:box',{w:10,h:4,background:'primary',parent:p});
			c.emit('interface:box',{w:10,h:2,background:'tertiary',parent:p});
			c.emit('interface:box',{w:10,h:2,background:'tertiary',parent:p});
			c.emit('interface:box',{w:10,h:2,background:'tertiary',parent:p});
		});

		// Row 3		
		c.emit('interface:box',{w:2,h:3,background:'tertiary'});
		c.emit('interface:box',{w:4,h:3,background:'secondary'});

		c.emit('interface:box',{w:2,h:3,background:'primary', id:'graph2'}, function() {
			// Without `new` keyword
			Grapho({
				data: [10,5,7,6,5,2,5,5,6,7,8,8,9,9,8,7,5,5,6,7,6,5,5,2,4,5,4],
				debug: true,
				place: document.getElementById('graph2')
			});
		});

		c.emit('interface:box',{w:2,h:3,background:'tertiary'});
	}); 

	c.emit('host:connect');
});
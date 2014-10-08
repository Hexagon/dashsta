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
	c.on('host:connected', function () {

		// Make sure the stage is set
		c.emit('interface:clear');

		// Row 1
			// Create a container 3 units wide and 3 units high, and place 3 subboxes in it
			// 1 unit is 10% width
			// 1 unit is 40px of height
			c.emit('interface:container', { w: 3, h: 3 }, function (p) {
				// In containers, both width and height are in percentage, of parent container
				c.emit('interface:box', { w: 10, h: 6, background:'primary', parent: p });
				c.emit('interface:box', { w: 10, h: 4, background:'tertiary', parent: p });
			});

			c.emit('interface:box', { w: 3, h: 3, background:'tertiary' });
			c.emit('interface:box', { w: 4, h: 3, background:'tertiary' });

		// Row 2
		c.emit('interface:box', { w: 4, h: 6,background: 'primary', id: 'graph' }, function () {

			// Using `new` keyword
			var aGraphoObject = new Grapho({
					debug: true,
					place: document.getElementById('graph')
			})
				// Add data post-creation using defaults and simple array
				.addSeries([7, 6, 5, 4, 4, 4, 4, 7, 7, 7, 5, 5, 4, 3, 3, 4, 5, 6, 7, 7, 2, 8, 5, 5, 4, 2])

				// Add a area chart to the same axis (default, using some special properies)
				.addSeries({
					fillStyle: 'rgba(0, 255, 0, 1.0)',
					strokeStyle: 'rgba(0, 255, 0, 0.2)',
					type: 'area',
					data: [-7, -7, 3, 4, 5, 4, 55, 58, 55, 60, 70, 80, 0, -7, -7, -5, 2, -5, 5, 8, 3, -6, 5, 5]
				});

			// Add data post-creation using a custom object, transparent bars (color uses context.fillStyle syntax)
			// This is supposed to mess up the y axis pretty much
			aGraphoObject.addSeries({
				fillStyle: 'rgba(0, 255, 0, 0.2)',
				type: 'bar',
				data: [1, 2, 3, 5, 8, 7, 5, 4, 66, 5, 6, 5, 2, 2, 2, 6, 7, 2, 66]
			});

			// Add data post-creation using defaults and maxed out object
			// This one rocks it's own y axis
			aGraphoObject.addSeries({
				strokeStyle: 'rgba(255, 0, 0, 0.2)',
				type: 'line',
				yAxis: 2,
				yMin: -50,
				yMax: 50,
				data: [7, 6, 5, 4, 4, 4, 4, 7, 7, 7, 5, 5, 4, 3, 3, 4, 5, 6, 7, 7, 2, 8, 5, 5, 4, 2, 4]
			});

			// Add a nice straight line at 75% of the height, in it's own axis
			// This one rocks it's own y axis
			aGraphoObject.addSeries({
				strokeStyle: 'rgba(0, 0, 255, 1.0)',
				type: 'line',
				yAxis: 3,
				yMin: 0,
				yMax: 100,
				data: [75, 75, 75]
			});

			// Add a nice straight pink line at 25% of the height, in the previous 0 - 100 axis
			aGraphoObject.addSeries({
				strokeStyle: 'rgba(255, 0, 255, 1.0)',
				yAxis: 3,
				data: [25, 25, 25]
			});

			// Getting crazy with upside down bars and shit at axis 4
			aGraphoObject.addSeries({
				fillStyle: 'rgba(255, 0, 0, 0.2)',
				type: 'bar',
				yAxis: 4,
				yCenter: 0,
				data: [60, 30, 0, -30, -60]
			});
		});

		c.emit('interface:container', { w: 6, h: 6 }, function (p) {
			c.emit('interface:box', { w: 10, h: 4, background:'primary', parent: p });
			c.emit('interface:box', { w: 10, h: 2, background:'tertiary', parent: p });
			c.emit('interface:box', { w: 10, h: 2, background:'tertiary', parent: p });
			c.emit('interface:box', { w: 10, h: 2, background:'tertiary', parent: p });
		});

		// Row 3		
		c.emit('interface:box', { w: 2, h: 3, background:'tertiary' });
		c.emit('interface:box', { w: 4, h: 3, background:'secondary' });

		c.emit('interface:box', { w: 2, h: 3, background: 'primary', id: 'graph2' }, function () {

			// Without `new` keyword, using object at initiation, add a nice area chart. And some weird positive upside-down bars
			Grapho({
				debug: true,
				place: document.getElementById('graph2')
			}).addSeries({
				data: [1, 2, 1, 3, 6, 1, 5, 0, 2, 0, 6, 2, 3, 4, 2, 6, 3, 2, 0, 5, 5, 2, 3, 3, 5, 2, 3],
				type: 'bar',
				yCenter: 10,
				yAxis: 1,
				fillStyle: 'rgba(255,0,0,0.1)'
			}).addSeries({
				data: [10, 5, 7, 6, 5, 2, 5, 5, 6, 7, 8, 8, 9, 9, 8, 7, 5, 5, 6, 7, 6, 5, 5, 2, 4, 5, 4],
				type: 'area',
				yAxis: 2,
				lineWidth: 1,
				strokeStyle: '#FFFFFF',
				fillStyle: 'rgba(0,0,255,0.1)'
			});
		});

		c.emit('interface:box', { w: 2, h: 3, background:'tertiary' });

	});

	c.emit('host:connect');

});
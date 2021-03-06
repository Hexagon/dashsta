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
				.addDataset([7, 6, 5, 4, 4, 4, 4, 7, 7, 7, 5, 5, 4, 3, 3, 4, 5, 6, 7, 7, 2, 8, 5, 5, 4, 2])

				// Add a area chart to the same axis (default, using some special properies)
				.addDataset({
					fillStyle: 'rgba(0, 255, 0, 1.0)',
					strokeStyle: 'rgba(0, 255, 0, 0.2)',
					type: 'area',
					x: { axis:1, continous: true },
					data: [-7, -7, 3, 4, 5, 4, 55, 58, 55, 60, 70, 80, 0, -7, -7, -5, 2, -5, 5, 8, 3, -6, 5, 5]
				});

			// Add data post-creation using defaults and maxed out object
			// This one rocks it's own y axis
			aGraphoObject.addDataset({
				strokeStyle: 'rgba(255, 0, 0, 1)',
				type: 'area',
				lineWidth: 3,
				lineDots: true,
				lineSmooth: false,
				dotWidth: 10,
				y: { 
					axis: 2,
					min: -50,
					max: 50
				},
				data: [7, 6, 5, 4, 4, 4, 4, 7, 7, 7, 5, 5, 4, 3, 3, 4, 5, 6, 7, 7, 2, 8, 5, 5, 4, 2, 4]
			});

			// Add data post-creation using defaults and maxed out object
			// This one rocks it's own y axis
			aGraphoObject.addDataset({
				strokeStyle: 'rgba(0, 255, 0, 1)',
				type: 'scatter',
				dotWidth: 3,
				x: {
					axis: 2,
					continous: true
				},
				y: { 
					axis: 2,
					min: -50,
					max: 50
				},
				data: [[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,6],[1,1],[1,2],[3,3],[3,4],[4,5],[4,6],[2,6]]
			});

			// Add data post-creation using a custom object, transparent bars (color uses context.fillStyle syntax)
			// This is supposed to mess up the y axis pretty much
			aGraphoObject.addDataset({
				fillStyle: 'rgba(0, 255, 0, 0.2)',
				type: 'bar',
				data: [1, 2, 3, 5, 8, 7, 5, 4, 66, 5, 6, 5, 2, 2, 2, 6, 7, 2, 66]
			});

			// Try to change y axis properties of axis 2, and draw a straight line all over the place
			aGraphoObject.addDataset({
				strokeStyle: 'rgba(255, 0, 0, 0.2)',
				type: 'line',
				y: { 
					axis: 2,
					min: 0,
					max: 10
				},
				data: [[0,3],[37,3]]
			});

			// Add a nice straight line at 75% of the height, in it's own axis
			// This one rocks it's own y axis
			aGraphoObject.addDataset({
				strokeStyle: 'rgba(0, 0, 255, 1.0)',
				type: 'line',
				y: {
					axis: 3,
					min: 0,
					max: 100
				},
				data: [75, 75, 75]
			});

			// Add a nice straight pink line at 25% of the height, in the previous 0 - 100 axis
			aGraphoObject.addDataset({
				strokeStyle: 'rgba(255, 0, 255, 1.0)',
				y: { axis: 3 },
				data: [25, 25, 25]
			});

			// Getting crazy with upside down bars and shit at axis 4
			aGraphoObject.addDataset({
				fillStyle: 'rgba(255, 0, 0, 0.2)',
				type: 'bar',
				y: { 
					axis: 4,
					center: 0
				},
				data: [60, 30, 0, -30, -60]
			});

			// Getting even more crazy with indexed data
			aGraphoObject.addDataset({
				fillStyle: 'rgba(255, 0, 0, 0.2)',
				type: 'bar',
				y: { 
					axis: 4,
					center: 0
				},
				data: [
					[20,60],
					[21,30],
					[22,0],
					[23,-30],
					[24,-60]
				]
			});

			// Getting most crazy with mixed in-bounds and out-of-bounds data
			aGraphoObject.addDataset({
				fillStyle: 'rgba(0, 255, 255, 0.2)',
				type: 'bar',
				y: { 
					axis: 4,
					center: 0
				},
				data: [
					[33,-60],
					[34,-30],
					[35,0],
					[36,30],
					[37,60]
				]
			});


			// Getting just as crazy with a smooth line
			aGraphoObject.addDataset({
				fillStyle: 'rgba(255, 255, 0, 0.2)',
				type: 'area',
				y: { 
					axis: 5,
					center: 0
				},
				lineSmooth: true,
				data: [
					[33,60],
					[34,20],
					[35,0],
					[36,-20],
					[37,-60],
				]
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
			}).addDataset({
				data: [1, 2, 1, 3, 6, 1, 5, 0, 2, 0, 6, 2, 3, 4, 2, 6, 3, 2, 0, 5, 5, 2, 3, 3, 5, 2, 3],
				type: 'bar',
				y: {
					center: 10,
					axis: 1
				},
				fillStyle: 'rgba(255,0,0,0.1)'
			}).addDataset({
				data: [10, 5, 7, 6, 5, 2, 5, 5, 6, 7, 8, 8, 9, 9, 8, 7, 5, 5, 6, 7, 6, 5, 5, 2, 4, 5, 4],
				type: 'area',
				y: {
					axis: 2
				},
				lineWidth: 1,
				strokeStyle: '#FFFFFF',
				fillStyle: 'rgba(0,0,255,0.1)'
			});
		});

		c.emit('interface:box', { w: 2, h: 3, background:'tertiary' });

	});

	c.emit('host:connect');

});
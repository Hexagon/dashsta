(function (self, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define([], factory);
	} else {
		// Attaches to the current context.
		self.Grapho = factory();
	}
}(this, function () {
	// A collection of all instantiated Grapho's
	var graphos = [],
		toString = Object.prototype.toString;

	function isUntypedObject (it) {
		var key;

		if (!it || it.nodeType || it == it.window || toString.call(it) !== '[object Object]') {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if (it.constructor && !it.hasOwnProperty('constructor') && !it.constructor.prototype.hasOwnProperty('isPrototypeOf')) {
				return false;
			}
		} catch (e) {
			return false;
		}

		// Own properties are enumerated firstly, so to speed up, if last one is own, then all properties are own.
		for (key in it) {}
		return key === undefined || it.hasOwnProperty(key);
	}

	function merge (target, source) {
		var name;

		for (name in source) {
			if (source[name] !== undefined) {
				if (target[name] && toString.call(target[name]) === '[object Object]' && isUntypedObject(source[name])) {
					merge(target[name], source[name]);
				} else {
					target[name] = source[name];
				}
			}
		}

		return target;
	}

	function Grapho (settings) {
		var place;

		// Protect against forgotten `new` keyword.
		if (!(this instanceof Grapho)) {
			return new Grapho(settings);
		}

		// Setup default settings
		this.axises = [];

		this.container = {
			width: 'auto',
			height: 'auto'
		};

		this.x = {
			showAxis: false,
			showLabels: false,
		};

		this.debug = false;

		// If the user has defined a parent element in the settings object,
		// save it and remove it from the settings so that it won't be merged into `this`.
		if (settings.place) {
			place = settings.place;
			settings.place = undefined;
		}

		// Merge the user settings into `this`
		if (settings) {
			merge(this, settings);
		}
		
		// These aren't settings but needed properties.
		this.id = graphos.push(this) - 1;

		this.canvas = document.createElement('canvas');
		this.context = this.canvas.getContext('2d');
		this.width = 0;
		this.height = 0;
		this.destination = 0;

		// Call the this.place() method if the user has specified an parent.
		if (place) {
			this.place(place);
		}

		// Init done
		this.done = true;

	}

	/**
	 * Check that a axist exists, if not, initiate it
	 * @param  {Integer} index Axis index, starting from 1
	 * @return {Object}                `this`
	 */
	Grapho.prototype.initAxis = function (index, properties) {

		var defaults = {
			yMin: 'auto',
			yMax: 'auto',
			yMinVal: Infinity,
			yMaxVal: -Infinity,
			yCenter: 0,
			series: []
		};

		if ( typeof index === 'number' && isFinite(index) && index%1===0 ) {
			if ( this.axises[index] === undefined ) {

				// Merge properties, if passed
				if ( typeof properties === 'object' ) {
					defaults = merge(defaults, properties);
				}

				this.axises[index] = defaults;
				if (this.debug) console.info('Grapho.checkAxis: New axis with index ', index, 'created');
			}
		} else {
			console.error('Grapho.checkAxis: Invalid yAxis index received, should be integer >= 1');
		}

		// Chain
		return this;
	};

	/**
	 * Add series
	 * @param  {Object} series object containing data, or pure data array
	 * @return {Object}                `this`
	 */
	Grapho.prototype.addSeries = function (series) {

		if (this.debug) console.info('Adding series');

		// Check that we got some type of valid object as parameter
		if (typeof series !== 'object' ) {

			console.error('Grapho.addSeries: series does not seem to be a valid javascript object.');
			return this;

		} else if (typeof series === 'object' && (series.data === undefined && !Array.isArray(series)) ) {

			console.error('Grapho.addSeries: passed parameter is neither an array, nor containing series.data.');
			return this;

		}

		// Define some reasonable defaults for each series
		var defaults = {

			// All types
			yAxis: 1,

			type: 'line',

			yMin: 'auto',
			yMax: 'auto',

			yCenter: 0,

			// type: 'line'
			lineWidth: 2,
			lineSmooth: true,
			strokeStyle: '#9494BA',
			fillStyle: '#BA9494',

			// type: 'bar'
			barWidthPrc: 90 

		};

		if (Array.isArray(series)) {

			// Got pure array
			defaults.data = series;

		} else {

			// Got full object
			defaults = merge(defaults, series);

		}

		// Make sure the axis exists
		this.initAxis(defaults.yAxis, { yMin: defaults.yMin, yMax: defaults.yMax, yCenter: defaults.yCenter });

		// Push series to axis
		if (this.debug) console.info('Pushing generated series object to axis', defaults);
		this.pushSeries(defaults);
		
		// Redraw, but only if the object is fully initiated
		if(this.done) this.redraw();

		// Chain
		return this;
	};

	/**
	 * Push finished series object to axis
	 * @param  {Object} series object containing data, or pure data array
	 * @return {Object}                `this`
	 */
	Grapho.prototype.pushSeries = function (series) {

		if (this.debug) console.info('Pushing series', series );

		// Update axis min/max of axis, last series of axis has the control
		if ( this.axises[ series.yAxis ].yMin == 'auto' ) {
			this.axises[ series.yAxis ].yMinVal = Math.min(Math.min.apply(null, series.data), this.axises[ series.yAxis ].yMinVal);
		} else {
			this.axises[ series.yAxis ].yMinVal = this.axises[ series.yAxis ].yMin;
		}
		if ( this.axises[ series.yAxis ].yMax == 'auto' ) {
			this.axises[ series.yAxis ].yMaxVal = Math.max(Math.max.apply(null, series.data), this.axises[ series.yAxis ].yMaxVal);
		} else {
			this.axises[ series.yAxis ].yMaxVal = this.axises[ series.yAxis ].yMax;
		}

		this.axises[ series.yAxis ].series.push(series);

		// Chain
		return this;
	};

	/**
	 * Moves
	 * @param  {Element} newDestination Destination element
	 * @return {Object}                `this`
	 */
	Grapho.prototype.place = function (newDestination) { 
		this.destination = newDestination;

		if ('appendChild' in this.destination) {
			this.destination.appendChild(this.canvas);
		} else {
			if (this.debug) console.error('Graph placed in invalid destination');
		}

		this.resize(this);

		return this;
	};

	/**
	 * Remove this graph from the current destination
	 * @return {Object} `this`.
	 */
	Grapho.prototype.remove = function () {
		if (this.container.width == 'auto' || this.container.height == 'auto')
		window.removeEventListener('resize', resize);

		// ToDo, remove actual element
		canvas.parentElement.removeChild(canvas);

		return this;
	};

	/**
	 * Redraws the canvas
	 * @return {Object} `this`.
	 */
	Grapho.prototype.redraw = function () {
		var margin,
			inner_height,
			inner_width,
			base_width,
			bar_spacing,
			bar_width,
			i,
			series,
			cur,
			data,

			fpx, px, py, npx, npy, xc, yc, bb, bt, cy,

			// Shortcuts
			axises = this.axises,
			min,
			max;

		if (this.debug) console.info('Redrawing canvas',series);

		if (!axises.length) {
			return;
		}

		// Clear canvas before drawing
		this.context.clearRect ( 0 , 0 , this.width , this.height );

		for (var ai=1; ai<=axises.length-1; ai++) {

			series = axises[ai].series;
			min = axises[ai].yMinVal;
			max = axises[ai].yMaxVal;
			center = axises[ai].yCenter;

			for (var si=0; si<series.length; si++) {

				cur = series[si];
				data = cur.data;

				if (cur.type === 'line' || cur.type === 'area') {

					margin = cur.lineWidth / 2;
					inner_height = this.height - margin;
					inner_width = this.width - margin;

					this.context.beginPath();
					
					fpx = Math.round(margin);	// First pixel x

					for (i = 0; i < data.length; i++) {

						px = Math.round(margin + (i * (inner_width / (data.length - 1))));	// Pixel x
						py = Math.round(margin + inner_height - (data[i] - min) / (max - min) * inner_height); // Pixel y
						cy = Math.round(margin + inner_height - (center - min) / (max - min) * inner_height); // Center pixel y
						npx = Math.round(margin + (i + 1) * (inner_width / (data.length-1))); // Next pixel x
						npy = Math.round(margin + inner_height - (data[i + 1] - min) / (max - min) * inner_height); // Next pixel y

						if (i === 0) {
							this.context.moveTo(px, py);
						} else if(i < data.length - 2 && cur.lineSmooth) {
							xc = (px + npx) / 2;
							yc = (py + npy) / 2;

							this.context.quadraticCurveTo(px, py, xc, yc);
						} else if(i < data.length && cur.lineSmooth) {
							this.context.quadraticCurveTo(px, py, npx, npy);
						} else {
							this.context.lineTo(px,py);
						}
					}

					this.context.lineWidth = cur.lineWidth;
					this.context.strokeStyle = cur.strokeStyle;
					this.context.stroke();

					if (cur.type === 'area') {
						this.context.lineTo(px, cy); // Move to center last, in case of area
						this.context.lineTo(fpx, cy); // Move to center last, in case of area

						// Empty stroke, as we just want to move the cursor
						this.context.strokeStyle = 'rgba(0,0,0,0)';
						this.context.lineWidth = 0;
						this.context.stroke();
					}

					if (cur.type === 'area') {
						this.context.fillStyle = cur.fillStyle;	
						this.context.fill();
					} 
					

				} else if (cur.type == 'bar') {

					margin = 1;
					inner_height = this.height - margin;
					inner_width = this.width - margin;
					base_width = (inner_width / data.length);
					bar_spacing = base_width-(base_width*cur.barWidthPrc/100);
					bar_width = base_width - bar_spacing;

					this.context.fillStyle = cur.fillStyle;

					for (i = 0; i < data.length; i++) {

						px = Math.round(margin + bar_spacing / 2 + (base_width * i));
						bt = (data[i]<=center) ? center : data[i], // Bar top
						bb = (data[i]>center) ? center : data[i], // Bar bottom
						py = Math.round(margin + inner_height - (bt - min) / (max - min) * inner_height),
						bh = Math.round(margin + inner_height - (bb - min) / (max - min) * inner_height) - py;

						this.context.fillRect(px, py, bar_width, bh);

					}

				}

			}

		}

		return this;
	};

	/**
	 * Something something
	 * @return {Object} `this`.
	 */
	Grapho.prototype.resize = function () {
		if ((this.width = this.container.width) === 'auto') {
			this.width = getComputedStyle(this.destination, null).getPropertyValue('width');
		}

		if ((this.height = this.container.height) === 'auto') {
			this.height = getComputedStyle(this.destination, null).getPropertyValue('height');
		}

		this.canvas.height = this.height = parseInt(this.height);
		this.canvas.width = this.width = parseInt(this.width);

		if (this.debug) console.info('Resizing canvas, new dimensions:', this.destination.clientWidth, this.canvas.width, this.canvas.height);

		this.redraw();

		return this;
	};

	// Connect resize event in case of
	window.addEventListener('resize', function () {
		var graph, i = 0;

		while ((graph = graphos[i++])) {
			graph.resize();
		}
	});

	return Grapho;
}));
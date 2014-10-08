(function (self, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define([], factory);
	} else {
		// Attaches to the current ctx.
		self.Grapho = factory();
	}
}(this, function () {
	// A collection of all instantiated Grapho's
	var graphos = [],
		undef,
		round = Math.round,
		toString = Object.prototype.toString,
		isArray = Array.isArray || function (it) {
			return toString.call(it) == '[object Array]';
		},
		prot = Grapho.prototype;

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
		
		// Why empty block? 
		// for (key in it) {}

		return key === undef || it.hasOwnProperty(key);
	}

	function merge (target, source) {
		var name;

		for (name in source) {
			if (source[name] !== undef) {
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
			showLabels: false
		};

		// If the user has defined a parent element in the settings object,
		// save it and remove it from the settings so that it won't be merged into `this`.
		if (settings.place) {
			place = settings.place;
			settings.place = undef;
		}

		// Merge the user settings into `this`
		if (settings) {
			merge(this, settings);
		}
		
		// These aren't settings but needed properties.
		this.id = graphos.push(this) - 1;

		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d');
		this.w = 0;
		this.h = 0;
		this.dest = 0;

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
	prot.initAxis = function (index, properties) {
		var defaults = {
			yMin: 'auto',
			yMax: 'auto',
			yMinVal: Infinity,
			yMaxVal: -Infinity,
			yCenter: 0,
			series: []
		};

		if (typeof index === 'number' && isFinite(index) && index % 1 ===0) {
			if (this.axises[index] === undef) {

				// Merge properties, if passed
				if (typeof properties === 'object') {
					defaults = merge(defaults, properties);
				}

				this.axises[index] = defaults;

			}
		}

		// Chain
		return this;
	};

	/**
	 * Add series
	 * @param  {Object} series object containing data, or pure data array
	 * @return {Object}                `this`
	 */
	prot.addSeries = function (series) {
		var seriesIsArray = isArray(series);

		// Check that we got some type of valid object as parameter
		if (typeof series !== 'object' ) {
			return this;
		} else if (!seriesIsArray && !series.data) {
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

		// `series` can be either an array or an object.
		if (seriesIsArray) {
			defaults.data = series;
		} else {
			defaults = merge(defaults, series);
		}

		// Make sure the axis exists
		this.initAxis(defaults.yAxis, { yMin: defaults.yMin, yMax: defaults.yMax, yCenter: defaults.yCenter });

		// Push series to axis
		this.pushSeries(defaults);

		// Redraw, but only if the object is fully initiated
		if (this.done === true) this.redraw();

		// Chain
		return this;
	};

	/**
	 * Push finished series object to axis
	 * @param  {Object} series object containing data, or pure data array
	 * @return {Object}                `this`
	 */
	prot.pushSeries = function (series) {
		var yAxis = this.axises[series.yAxis];

		// Update axis min/max of axis, last series of axis has the control
		yAxis.yMaxVal = yAxis.yMax !== 'auto' ? yAxis.yMax : Math.max(Math.max.apply(null, series.data), yAxis.yMaxVal);
		yAxis.yMinVal = yAxis.yMin !== 'auto' ? yAxis.yMin : Math.min(Math.min.apply(null, series.data), yAxis.yMinVal);

		yAxis.series.push(series);

		// Chain
		return this;
	};

	/**
	 * Moves
	 * @param  {Element} newDestination Destination element
	 * @return {Object}                `this`
	 */
	prot.place = function (newDestination) { 
		var method = (newDestination && (newDestination.appendChild ? 'appendChild' : 'append'));

		if (method) {
			this.dest = newDestination;
			this.dest[method](this.canvas);
			this.resize(this);
		}

		return this;
	};

	/**
	 * Remove this graph from the current destination
	 * @return {Object} `this`.
	 */
	prot.remove = function () {
		if (this.container.width === 'auto' || this.container.height === 'auto') {
			window.removeEventListener('resize', this.resize);
		}

		// ToDo, remove actual element
		this.canvas.parentElement.removeChild(this.canvas);

		return this;
	};

	/**
	 * Redraws the canvas
	 * @return {Object} `this`.
	 */
	prot.redraw = (function () {

		/**
		 * Renders Line and Area chart
		 * @param {Object} graph The Grapho object
		 * @param {Array} serie The data series
		 * @param {Object} axis  Axis information
		 */
		function RenderLineAndArea (graph, serie, axis) {
			var i, point,
				
				data	= serie.data,
				margin 	= serie.lineWidth / 2,

				min 	= axis.yMinVal,
				max 	= axis.yMaxVal,

				inner_height 	= graph.h - margin,
				inner_width 	= graph.w - margin,

				px, py, cy, npx, npy,

				// Shortcuts
				ctx = graph.ctx;	

			ctx.beginPath();

			i = 0;
			while ((point = data[i]) || point === 0) {
				px = round(margin + (i * (inner_width / (data.length - 1))));	// Pixel x
				py = round(margin + inner_height - (point - min) / (max - min) * inner_height); // Pixel y
				npx = round(margin + (i + 1) * (inner_width / (data.length - 1))); // Next pixel x
				npy = round(margin + inner_height - (data[i + 1] - min) / (max - min) * inner_height); // Next pixel y

				if (i === 0) {
					ctx.moveTo(px, py);
				} else if (i < data.length - 2 && serie.lineSmooth) {
					ctx.quadraticCurveTo(px, py, (px + npx) / 2, (py + npy) / 2);
				} else if (i < data.length && serie.lineSmooth) {
					ctx.quadraticCurveTo(px, py, npx, npy);
				} else {
					ctx.lineTo(px, py);
				}

				i++;
			}

			ctx.lineWidth = serie.lineWidth;
			ctx.strokeStyle = serie.strokeStyle;
			ctx.stroke();

			if (serie.type === 'area') {
				cy = round(margin + inner_height - (axis.yCenter - min) / (max - min) * inner_height); // Center pixel y

				ctx.lineTo(px, cy); // Move to center last, in case of area
				ctx.lineTo(round(margin), cy); // Move to center last, in case of area

				// Empty stroke, as we just want to move the cursor
				ctx.lineWidth = 0;
				ctx.stroke();

				ctx.fillStyle = serie.fillStyle;	
				ctx.fill();
			}
		}

		/**
		 * Renders a bar chart
		 * @param {Object} graph The Grapho object
		 * @param {Array} serie The data series
		 * @param {Object} axis  Axis information
		 */
		function RenderBarChart (graph, serie, axis) {
			var i, point,
				
				data	= serie.data,
				margin	= 1,

				min		= axis.yMinVal,
				max		= axis.yMaxVal,
				center	= axis.yCenter,

				inner_height 	= graph.h - margin,
				base_width 		= ((graph.w - margin) / data.length),
				bar_spacing 	= base_width - (base_width * serie.barWidthPrc / 100),
				bar_width	 	= base_width - bar_spacing,

				px, bt, bb, py, bh;

			graph.ctx.fillStyle = serie.fillStyle;

			i = 0;
			while ((point = data[i++]) || point === 0) {
				px = round(margin + bar_spacing / 2 + (base_width * (i - 1)));
				bt = (point <= center) ? center : point; // Bar top
				bb = (point > center) ? center : point; // Bar bottom
				py = round(margin + inner_height - (bt - min) / (max - min) * inner_height);
				bh = round(margin + inner_height - (bb - min) / (max - min) * inner_height) - py;

				graph.ctx.fillRect(px, py, bar_width, bh);
			}
		}

		/**
		 * The front `redraw` methods.
		 * Calls the appropriate private rendering function.
		 * @return {Object} `this`
		 */
		return function () {
			var i, x,
				serie,
				axis;

			if (this.axises.length) {
				// Clear canvas before drawing
				this.ctx.clearRect(0, 0, this.w, this.h);

				i = 1; // Why one-based?
				while ((axis = this.axises[i++])) {

					x = 0;
					while ((serie = axis.series[x++])) {
						if (serie.type === 'bar') {
							RenderBarChart(this, serie, axis);
						} else if (serie.type === 'line' || serie.type === 'area') {
							RenderLineAndArea(this, serie, axis);
						} 
					}
				}
			}

			return this;
		};
	}());

	/**
	 * Something something
	 * @return {Object} `this`.
	 */
	prot.resize = function () {
		if ((this.w = this.container.width) === 'auto') {
			this.w = getComputedStyle(this.dest, null).getPropertyValue('width');
		}

		if ((this.h = this.container.height) === 'auto') {
			this.h = getComputedStyle(this.dest, null).getPropertyValue('height');
		}

		this.canvas.height = this.h = parseInt(this.h);
		this.canvas.width = this.w = parseInt(this.w);

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
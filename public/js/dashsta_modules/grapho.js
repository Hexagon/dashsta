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
		this.type = 'bar';

		this.container = {
			width: 'auto',
			height: 'auto',
			lineWidthPx: 3,
			lineSmooth: true,
			barWidthPrc: 90 
		};

		this.x = {
			showAxis: false,
			showLabels: false,
		};

		this.y = {
			showAxis: false,
			showLabels: false,
			min: 'auto',
			max: 'auto'
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
		this.data = settings.data;

		this.canvas = document.createElement('canvas');
		this.context = this.canvas.getContext('2d');
		this.width = 0;
		this.height = 0;
		this.destination = 0;

		this.min = (this.y.min == 'auto') ? Math.min.apply(Math, settings.data) : this.y.min;
		this.max = (this.y.max == 'auto') ? Math.max.apply(Math, settings.data) : this.y.max;

		// Call the this.place() method if the user has specified an parent.
		if (place) {
			this.place(place);
		}
	}

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

			px, py, npx, npy, xc, yc,

			// Shortcuts
			data = this.data,
			min = this.min,
			max = this.max;

		if (this.debug) console.info('Redrawing canvas');

		if (!data.length) {
			return;
		}

		if (this.type === 'line') {
			margin = this.container.lineWidthPx / 2;
			inner_height = this.height - margin;
			inner_width = this.width - margin;

			this.context.beginPath();

			for (i = 0; i < data.length; i++) {
				px = Math.round(margin + (i * (inner_width / (data.length - 1))));
				py = Math.round(margin + inner_height - (data[i] - min) / (max - min) * inner_height);
				npx = Math.round(margin + (i + 1) * (inner_width / (data.length-1)));
				npy = Math.round(margin + inner_height - (data[i + 1] - min) / (max - min) * inner_height);

				if (i === 0) {
					this.context.moveTo(px, py);
				} else if(i < data.length - 2 && this.container.lineSmooth) {
					xc = (px + npx) / 2;
					yc = (py + npy) / 2;

					this.context.quadraticCurveTo(px, py, xc, yc);
				} else if(i < data.length && this.container.lineSmooth) {
					this.context.quadraticCurveTo(px, py, npx, npy);
				} else {
					this.context.lineTo(px,py);
				}
			}

			this.context.lineWidth = this.container.lineWidthPx;
			this.context.strokeStyle = '#333333';
			this.context.stroke();
		} else if (this.type == 'bar') {
			margin = 1;
			inner_height = this.height - margin;
			inner_width = this.width - margin;
			base_width = (inner_width / data.length);
			bar_spacing = base_width-(base_width*this.container.barWidthPrc/100);
			bar_width = base_width - bar_spacing;

			for (i = 0; i < data.length; i++) {
				px = Math.round(margin + bar_spacing / 2 + (base_width * i));
				py = Math.round(margin + inner_height - (data[i] - min) / (max - min) * inner_height);

				this.context.rect(px, py, bar_width, inner_height - py);
			}

			this.context.fillStyle = '#333333';
			this.context.fill();
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
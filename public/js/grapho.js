// Using constructor:
function Grapho (_data,_settings,_debug) {

  // Private variables
  var data=_data,
    settings,
    debug=(_debug===undefined) ? false : true,
    canvas,
    context,
    width,
    height,
    destination,

    default_settings = {
      type: "bar",
      container: {
        width: "auto",
        height: "auto",
        lineWidthPx: 3,
        lineSmooth: true,
        barWidthPrc: 90 
      },
      x: {
        showAxis: false,
        showLabels: false,
      },
      y: {
        showAxis: false,
        showLabels: false,
        min: "auto",
        max: "auto"
      }
    },

    merge = function(o,u) {
      for (var p in u) {
        try { o[p] = (u[p].constructor==Object) ? merge(o[p], u[p]) : o[p] = u[p]; } 
        catch(e) { o[p] = u[p]; }
      }
      return o;
    },

    amax = function(a) {
      var m=-Infinity,i=-1;
      while(++i<a.length) {
        m = Math.max(a[i],m);
      }
      return m;
    },

    amin = function(a) {
      var m=Infinity,i=-1;
      while(++i<a.length) m = Math.min(a[i],m);
      return m;
    },

    /* Size canvas to container */
    resize = function() {

      width = canvas.width = (settings.container.width == "auto")
                        ? parseInt(window.getComputedStyle(destination, null).getPropertyValue('width').replace('px',''))
                        : settings.container.width;
      height = canvas.height = (settings.container.height == "auto")
                        ? parseInt(window.getComputedStyle(destination, null).getPropertyValue('height').replace('px',''))
                        : settings.container.height;

      if (debug) console.info('Resizing canvas, new dimensions:', destination.clientWidth, canvas.width, canvas.height);

      redraw();
    },

    /* Redraw graph */
    redraw = function() {
      
      if (debug) console.info('Redrawing canvas');

      if (settings.type == "line") {

        if (data.length>0) {

          var margin = settings.container.lineWidthPx/2,
              inner_height = height - margin,
              inner_width = width - margin;

          context.beginPath();

          for (var i=0; i<data.length; i++) {
            var 
              px = Math.round(margin+(i*(inner_width/(data.length-1))),
              py = Math.round(margin+inner_height-(data[i]-min)/(max-min)*inner_height));
              npx = Math.round(margin+((i+1)*(inner_width/(data.length-1))),
              npy = Math.round(margin+inner_height-(data[(i+1)]-min)/(max-min)*inner_height));

            if(i==0){
              context.moveTo(px, py);
            } else if(i<data.length-2 && settings.container.lineSmooth) {
              var xc = (px + npx) / 2;
              var yc = (py + npy) / 2;
              context.quadraticCurveTo(px, py, xc, yc);
            } else if(i<data.length && settings.container.lineSmooth) {
              context.quadraticCurveTo(px, py, npx, npy);
            } else {
              context.lineTo(px,py);
            }
          }
          context.lineWidth=settings.container.lineWidthPx;
          context.strokeStyle='#333333';
          context.stroke();
        }

      } else if (settings.type == "bar") {

        if (data.length>0) {

          var margin = 1,
              inner_height = height - margin,
              inner_width = width - margin,
              base_width = (inner_width / data.length),
              bar_spacing = base_width-(base_width*settings.container.barWidthPrc/100),
              bar_width = base_width - bar_spacing;


          for (var i=0; i<data.length; i++) {
            var 
              px = Math.round(margin+bar_spacing/2+(base_width*i)),
              py = Math.round(margin+inner_height-(data[i]-min)/(max-min)*inner_height);
              console.log(px,py);
              context.rect(px,py,bar_width,inner_height-py);

          }
          context.fillStyle='#333333';
          context.fill();

        }

      }


    },

    init = function() {
      canvas = document.createElement('canvas');
      context = canvas.getContext('2d');

      // Merge default settings and user settings
      settings = merge(default_settings, (_settings==undefined) ? {} : _settings);
      if (debug) console.info('Generated settings', settings);

      min = (settings.y.min=="auto") ? amin(data) : settings.y.min;
      max = (settings.y.max=="auto") ? amax(data) : settings.y.max;

      if (debug) console.info('Dataset max, min:', max, min);
      
    }();

  // Public methods
  this.place = function(_d) { 
    destination = _d;

    if ("appendChild" in destination) {
      destination.appendChild(canvas);
    } else {
      if (debug) console.error("Graph placed in invalid destination");
    }

    // Connect resize event in case of 
    if (settings.container.width == "auto" || settings.container.height == "auto")
      window.addEventListener('resize',resize);

    resize();
    
  };

  // Remove this graph from the current destination
  this.remove = function() {
    if (settings.container.width == "auto" || settings.container.height == "auto")
      window.removeEventListener('resize',resize);

    // ToDo, remove actual element
  }

}
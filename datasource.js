// Using constructor:
function DataSource (filename,callback) {

  // Private variables
  var _is_running=false;

  // Clarification of public variables
  this.properties = undefined;
  this.last_runtime = undefined;
  this.time_to_run = undefined;
  this.callback = callback;

  try {
    _properties = require(filename);
  } catch(e) {
    throw(filename + " contains invalid JSON.");
  }

  // Validate properties
  // ...
  // Throw on error
  // ...

  // Public methods
  this.isRunning = function () { return _is_running; };

  this.run = function() {
    // Oh yeah!


    // Notify other functions that this datasource is updated!
    // return this.callback( this.properties );
  };

}

// Check if it's time to run
DataSource.prototype.notifyTimeTick = function (d) {

  // Note, this function will run every second, mind the performance
  
  var p = this.properties,
      pt = this.time_to_run;  // The time object should be parsed at constructor, should not be done every second

  // WTF?!!?!?!??!! TIME MATCHING=?!?!?!?!
  if (p.trigger.type=="continous") {
    //if ( this.time_to_run )

  } else if(p.trigger.type=="daily") {

  } else if(p.trigger.type=="once") {

  }

};

module.exports = DataSource;

/*
function TimeoutError (message) {
  this.name = 'TimeoutError';
  this.message = (message || '');
}

function RejectedError (message) {
  this.name = 'RejectedError';
  this.message = (message || '');
}

TimeoutError.prototype = Error.prototype;
RejectedError.prototype = Error.prototype;

var e = new TimeoutError('Load timeout exceeded for x');

(e instanceof Error) // true
(e instanceof TimeoutError) // true
throw new TimeoutError('sdfsdfsdf');

Unchaught TimeoutError: sdfsdfsdf

*/
// Simple Timer class for creating timers on your pages. Don't expect it to
// keep perfect time, due to the problems with JavaScript timers (see John Resig's
// excellent post on the subject: http://ejohn.org/blog/how-javascript-timers-work/)
// 
// You get afterStart and afterPause callbacks, which can be passed in as options
// when initializing a new Timer object.
var Timer = Class.create({
  initialize: function(seconds, handler) {
    this.seconds = seconds;
    this.handler = handler;
    this.setupOptions(arguments);    
    this.start();
  },
  
  setupOptions: function(args) {
    this.options = $A(args)[2] || { };
    this.options.afterStart = this.options.afterStart || Prototype.emptyFunction;
    this.options.afterPause = this.options.afterPause || Prototype.emptyFunction;
  },
  
  perform: function() {
    var result = this.handler(this.seconds);
    this.seconds -= 1;
    return result;
  },
  
  start: function() {
    this._id = setInterval(this.perform.bind(this), 1000);
    this.options.afterStart(this.seconds);
  },
  
  pause: function() {
    clearInterval(this._id);
    this._id = null;
    this.options.afterPause(this.seconds);
  },
  
  isRunning: function() {
    return this._id != null;
  }
});
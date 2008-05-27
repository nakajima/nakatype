var Timer = Class.create({
  initialize: function(seconds, handler) {
    this.seconds = seconds;
    this.handler = handler;
    this.options = $A(arguments)[2];
    this.options.afterStart = this.options.afterStart || Prototype.emptyFunction;
    this.options.afterPause = this.options.afterPause || Prototype.emptyFunction;
    this.start();
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
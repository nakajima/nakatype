document.callbackCache = { };

// Add callbacks for functions
Object.addCallbacks = function(receiver, _callbacks) {
  if ( !document.callbackCache[receiver] ) {
    document.callbackCache[receiver] = { };
    return Object.addCallbacks(receiver, _callbacks);
  };
  
  // Sets up callbackCache for a method.
  var prepareForCallbacks = function(_method) {
    if ( document.callbackCache[this][_method] ) { return true; };
    document.callbackCache[this][_method] = { before: new Array, after: new Array };
    
    var _wrapper = (function(proceed) {
      var args = $A(arguments);
      var proceed = args.shift();

      var runCallback = function(_args, _callback) {
        return _callback.apply(this, _args)
      }.bind(this);

      document.callbackCache[this][_method]['before'].each(runCallback.curry(args));
      var result = proceed.apply(this, args);
      document.callbackCache[this][_method]['after'].each(runCallback.curry(args));
      return result;
    }.bind(this))

    this[_method] = this[_method].wrap(_wrapper);
  }.bind(receiver);
  
  // Adds a callback for a method
  var appendCallbackToChain = function(position, methodName, handler) {
    document.callbackCache[this][methodName][position].push(handler.bind(this));
  }.bind(receiver);
  
  // Sets up method in callbackCache (if not already), then adds callback.
  var processCallback = function(position, pair) {
    var _methodName = pair[0];
    var _handler = pair[1];
    var args = $A(position, _methodName, _handler);
    prepareForCallbacks(_methodName);
    appendCallbackToChain(position, _methodName, _handler);
  }.bind(receiver)
  
  $H(_callbacks['before']).each(processCallback.curry('before'));
  $H(_callbacks['after']).each(processCallback.curry('after'));
};
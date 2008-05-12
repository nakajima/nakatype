document.callbackCache = { };

Callbacks = {
  set: function(receiver, _callbacks) {
    if ( !document.callbackCache[receiver] ) {
      document.callbackCache[receiver] = { };
      return Callbacks.set(receiver, _callbacks);
    };
    
    // Sets up callbackCache for a method.
    var prepareForCallbacks = function(_method) {
      if ( document.callbackCache[this][_method] ) { return true; };
      document.callbackCache[this][_method] = { before: new Array, after: new Array };

      this[(_method + 'WithoutCallbacks')] = Prototype.K(this[_method]);
      
      var _wrapper = (function(proceed) {
        var args = $A(arguments);
        var proceed = args.shift();

        var runCallback = function(_args, _callback) {
          return _callback.apply(this, _args)
        }.bind(this);
        
        // If caller in callbackCache, and there are callbacks for method, try to run callbacks.
        // Else, just invoke original method.
        if (document.callbackCache[this] && document.callbackCache[this][_method]) {
          var beforeCallbacks = document.callbackCache[this][_method]['before'];
          var afterCallbacks  = document.callbackCache[this][_method]['after'];
          
          beforeCallbacks.each(runCallback.curry(args));
          var result = proceed.apply(this, args);
          afterCallbacks.each(runCallback.curry(args));
          
          return result;
        } else {
          return proceed.apply(this, args);
        }
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
  },
  
  reset: function(_receiver, _method) {
    if (_receiver && _method) { document.callbackCache[_receiver][_method] = { before: new Array, after: new Array }; return }
    else { return document.callbackCache = { }; }        
  }
};

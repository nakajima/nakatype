document.objectsWithCallbacks = new Array;

Callbacks = {
  set: function(receiver, _callbacks) {
    if ( !receiver.callbackCache ) {
      receiver.callbackCache = { };
      if ( !document.objectsWithCallbacks[receiver] ) { document.objectsWithCallbacks.push(receiver) }
      return Callbacks.set(receiver, _callbacks);
    };
    
    // Sets up callbackCache for a method.
    var prepareForCallbacks = function(_method) {
      if ( this.callbackCache[_method] ) { return true; };
      this.callbackCache[_method] = { before: new Array, after: new Array };

      this[(_method + 'WithoutCallbacks')] = Prototype.K(this[_method]);
      
      var _wrapper = (function(proceed) {
        var args = $A(arguments);
        var proceed = args.shift();
        
        // If caller in callbackCache, and there are callbacks for method, try to run callbacks.
        // Else, just invoke original method.
        if (this.callbackCache[_method]) {
          var beforeCallbacks = this.callbackCache[_method]['before'];
          var afterCallbacks  = this.callbackCache[_method]['after'];
          
          var runCallback = function(_args, _callback) {
            return _callback.apply(this, _args)
          }.bind(this);
          
          beforeCallbacks.each(runCallback.curry(args));
          var result = proceed.apply(this, args);
          if (result != false) { afterCallbacks.each(runCallback.curry(args)); }          
          
          return result;
        } else {
          return proceed.apply(this, args);
        }
      }.bind(this))

      this[_method] = this[_method].wrap(_wrapper);
    }.bind(receiver);

    // Adds a callback for a method
    var appendCallbackToChain = function(position, methodName, handler) {
      this.callbackCache[methodName][position].push(handler.bind(this));
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
  
  reset: function(_method, _receiver) {
    var stripCallbacks = function(method, receiver) {
      if ( receiver.callbackCache ) {
        receiver.callbackCache[method] = { before: new Array, after: new Array };
      };      
    }
    
    if (_receiver && _method) { stripCallbacks(_method, _receiver); return }
    if (_method && !_receiver) { document.objectsWithCallbacks.each(stripCallbacks.curry(_method)); return }
    if (!_method && !_receiver) {
      document.objectsWithCallbacks.each(function(o) { o.callbackCache = { } }); return
    };
  }
};

Callbacks.add = Callbacks.set
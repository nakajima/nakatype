(function() {
  var fireEvent = function(name) {
    var args = $A(arguments).slice(1);
    document.fire(name, {
      transport: args[0],
      nativeObj: args[1],
      evaldJSON: args[2]
    });
  };
  
  var CallbackEvents = {
    onCreate: fireEvent.curry('request:created'),
    onComplete: fireEvent.curry('request:completed'),
    onException: fireEvent.curry('request:raised'),
    onInteractive: fireEvent.curry('request:interactive'),
    onLoaded: fireEvent.curry('request:loaded')
  };
  
  Ajax.Responders.register(CallbackEvents);
})();
// Fires events for main AJAX request callbacks. Not quite sure
// why this would be better than just using regular Ajax.Responder
// stuff. Maybe it would allow for some more modular code? We'll see.
// Note: This is rather untested.
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
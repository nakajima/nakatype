// Logs messages using either the browser's built-in console,
// or alerts messages with level, if the browser doesn't support
// that type of logging.
var logger = (function() {
  function say(message, level) {
    (console && console[level])
      ? console[level](message)
      : alert(level.toUpperCase() + ': ' + message);
  };
  
  return {
    debug: function(message) {
      return say(message, 'debug')
    },

    info: function(message) {
      return say(message, 'info')
    },

    warn: function(message) {
      return say(message, 'warn')
    },
    
    error: function(message) {
      return say(message, 'error')
    }
  }  
})()

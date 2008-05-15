// Fires a custom event every time the hash changes. It does so by 
// checking for a change at a set interval (0.2 seconds by default).
// Also passes the current hash in the memo object to make things
// easier for event handlers.

(function() {
  var HashWatcher = {
    CURRENT: null,
    INTERVAL: 0.2,
    
    check: function(pe) {
      var hash = window.location.href.split('#')[1];
      if (HashWatcher.CURRENT != hash) {
        document.fire('hash:changed', { currentHash: hash });
        HashWatcher.CURRENT = hash;
      };
    }
  };
  
  new PeriodicalExecuter(HashWatcher.check, HashWatcher.INTERVAL);
})();

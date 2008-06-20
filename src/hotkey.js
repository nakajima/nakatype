// Because everybody else has a HotKey implementation...
var HotKey = Class.create({
  initialize: function(key, handler) {
    key = key.toLowerCase();
    if ( HotKey.map[key] ) { HotKey.map[key].push(handler); }
    else {  HotKey.map[key] = [handler] }
  }
});

Hash.addMethods({
  findByValue: function(v) {
    var valueMatch = function(p) { return p.value == v; }
    return this.detect(valueMatch);
  }
});

Object.extend(HotKey, {
  map: { },
  
  check: function(event) {
    if (event.metaKey || event.ctrlKey) { return; }
    
    var key  = event.keyCode;
    var code = event.charCode || event.keyCode;
    var char = String.fromCharCode(code).toLowerCase();
    
    var key = char.match(/[a-z0-9]/) ? char : $H(Event).findByValue(key)[0];
    
    if (typeof(key) != 'undefined') {
      key = key.toLowerCase();
      if (HotKey.map[key]) { HotKey.map[key].each(function(f) { f(event); }) };
    };
  }
})

document.observe('keydown', HotKey.check);
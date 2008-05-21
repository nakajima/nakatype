var LazyClass = Class.create({
  makeLazy: function() {
    this.methodCache = { };
    
    var keys = $H(this).keys();
    this.methods = keys.without('initialize', 'constructor', 'handleMethod', 'makeLazy').select(function(key){
      return typeof(this[key]) == 'function';
    }.bind(this));

    var makeLazyMethod = function(method) {
      this.methodCache[method] = this[method];
      this[method] = this.handleMethod.curry(method);
      Object.extend(this[method], {
        valueOf: function() { return this.methodCache[method]; }.bind(this),
        toString: function() { return this.methodCache[method].toString(); }.bind(this)
      });
    }.bind(this);

    this.methods.each(makeLazyMethod);
  },
  
  handleMethod: function(method) {
    var args = $A(arguments).slice(1);
    return this.methodCache[method].apply(this, args);
  }
});

LazyClass.makeLazyClass = function(subclass) {
  Callbacks.set(subclass, {
    after: {
      addMethods: function(){
        subclass.prototype.initialize = subclass.prototype.initialize.wrap(function(proceed) {
          var args = $A(arguments).slice(1);
          var result = proceed.apply(this, args);
          this.makeLazy();
          return result;
        });
      }
    }
  });
};
  
LazyClass.inherited = function(subclass) {
  LazyClass.makeLazyClass(subclass);
};


Callbacks.set(LazyClass.subclasses, {
  before: {
    push: LazyClass.inherited
  }
});
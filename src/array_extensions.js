Object.extend(Array.prototype, {
  sum: function() {
    var values = this.select(Object.isNumber);
    return eval(values.join('+'));
  },
  
  mean: function() {
    var values = this.select(Object.isNumber);
    return values.sum() / values.length;
  },
  
  shuffle: function() {
    return this.sortBy(Math.random);
  }
})